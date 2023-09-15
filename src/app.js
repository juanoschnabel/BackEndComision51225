import express from "express";
import "./passport/passportStrategies.js";
import productRouter from "./routes/product.routes.js";
import sessionRouter from "./routes/session.router.js";
import createProductsWhitFacker from "./routes/fackerProducts.routes.js";
import cartRouter from "./routes/cart.routes.js";
import { __dirname } from "./config/path.js";
import { engine } from "express-handlebars";
import * as path from "path";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import config from "./utils/config.js";
import "./config/configDB.js";
import { Server } from "socket.io";
import { transporter } from "./utils/nodemailer.js";
import { MessagesManager } from "./controllers/MessageManager.js";
import compression from "express-compression";
import { addLogger } from "./utils/logger.js";
import logger from "./routes/loggerTest.routes.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
//CONFIGURACIONES
const app = express();
app.engine("handlebars", engine());
app.set("views", path.resolve(__dirname, "./views"));
app.set("view engine", "handlebars");
//PUERTO
const server = app.listen(config.PORT, () => {
  console.log(`Server on port ${config.PORT}`);
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion de las APIs",
      description: "Informacion de productos y carritos",
      version: "1.0.0",
      contact: {
        name: "Juan Schnabel",
      },
    },
  },
  apis: [`${process.cwd()}/src/docs/**/*.yaml`],
  //apis: [`./docs/**/*.yaml`],
};
const spec = swaggerJSDoc(swaggerOptions);
//MIDDLEWARES
app.use(compression());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// const upload = multer({ storage: storage });
app.use(cookieParser());
//HBS
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.URL_MONGODB_ATLAS,
      dbName: "ecommerce",
      collectionName: "cookies",
    }),
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
  })
);
//PASPORT
app.use(passport.initialize());
app.use(passport.session());
//ROUTES
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
app.use("/sessions", sessionRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/mockingproducts", createProductsWhitFacker);
app.use("/", express.static(__dirname + "/public"));
app.use(addLogger);
app.use("/loggerTest", logger);
// app.get("/logger", (req, res) => {
//   req.logger.warning("Alerta");
//   res.send({ message: " Estamos probando el logger" });
// });
app.get("/", async (req, res) => {
  res.render("sessions/login");
});
app.get("/chat", async (req, res) => {
  res.render("chat");
});
//SOCKET IO
const messagesManager = new MessagesManager(
  config.URL_MONGODB_ATLAS,
  "ecommerce",
  "messages"
);
const io = new Server(server);
io.on("connection", (socket) => {
  console.log("cliente conectado");
  socket.on("nuevoMensaje", async ([data]) => {
    const user = data.user;
    const mensaje = data.message;
    await messagesManager.addMessage(user, mensaje);
    const newMessage = await messagesManager.getMessages();
    io.emit("nuevosMensajes", newMessage);
  });
});
