/*
const socket = io();
//socket.emit() envia un mensaje
//socket.on() recibe un mensaje
socket.emit("mensaje", "Hola, buenos dias");

socket.emit("user", { username: "Juan", password: "1234" });
socket.on("confirmacionAcceso", (info) => {
  console.log(info);
});

socket.on("mensaje-socket-propio", (mensaje) => {
  console.log(mensaje);
});


const socket = io();
const botonChat = document.getElementById("botonChat");
const parrafosMensajes = document.getElementById("parrafosMensajes");
const val = document.getElementById("chatBox");
let user;
Swal.fire({
  title: "identificacion de usuario",
  text: "por favor, ingrese su nombre de usuario",
  input: "text",
  inputValidator: (valor) => {
    return !valor && "ingrese un valor valido";
  },
  allowOutsideClick: false,
}).then((resultado) => {
  user = resultado.value;
  console.log(user);
});
botonChat.addEventListener("click", () => {
  if (val.value.trim().length > 0) {
    socket.emit("mensaje", { user: user, mensaje: val.value });
    val.value = "";
  }
});
socket.on("mensajes", (arrayMensajes) => {
  parrafosMensajes.innerHTML = ""; //Para evitar duplicados
  arrayMensajes.forEach((mensaje) => {
    parrafosMensajes.innerHTML += `<p>${mensaje.user} : ${mensaje.mensaje}</p>`;
  });
});
*/
//REAL TIME PRODUCTS
// const socket = io();
// const titulo = document.getElementById("titulo");
// const descripcion = document.getElementById("descripcion");
// const precio = document.getElementById("precio");
// const categoria = document.getElementById("categoria");
// const stock = document.getElementById("stock");
// const status = document.getElementById("status");
// const imagen = document.getElementById("imagen");
// const codigo = document.getElementById("codigo");
// const form = document.getElementById("form");
// const producto = document.getElementById("producto");
// let products;

// form.addEventListener("submit", (event) => {
//   event.preventDefault();
//   socket.emit("mensaje", { products: products, mensaje: titulo.value });
// });
// socket.on("mensajes", (arrayMensajes) => {
//   producto.innerHTML = "";
//   arrayMensajes.forEach((mensaje) => {
//     producto.innerHTML += `<p>${mensaje.mensaje}</p>`;
//   });
// });

const socket = io();
const titulo = document.getElementById("titulo");
const descripcion = document.getElementById("descripcion");
const precio = document.getElementById("precio");
const categoria = document.getElementById("categoria");
const stock = document.getElementById("stock");
const status = document.getElementById("status");
const imagen = document.getElementById("imagen");
const codigo = document.getElementById("codigo");
const form = document.getElementById("form");
const producto = document.getElementById("producto");
let products;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  socket.emit("mensaje", {
    titulo: titulo.value,
    descripcion: descripcion.value,
    precio: precio.value,
    categoria: categoria.value,
    stock: stock.value,
    status: status.value,
    imagen: imagen.value,
    codigo: codigo.value,
    products: products,
  });
  // limpiar los campos después de enviar el formulario
  titulo.value = "";
  descripcion.value = "";
  precio.value = "";
  categoria.value = "";
  stock.value = "";
  status.value = "";
  imagen.value = "";
  codigo.value = "";
});

socket.on("mensajes", (arrayMensajes) => {
  producto.innerHTML = "";
  arrayMensajes.forEach((mensaje) => {
    producto.innerHTML += `<div class="card-group d-flex">
    <div class="row row-cols-12">
      <div class="card">
        <div class="text-center">
          <source srcset="..." type="image/svg+xml" />
          <img
            class="img-fluid img-thumbnail"
            src="{{thumbnail}}"
            alt="Imagen del producto"
          /></div>
        <div class="card-body">
          <h5 class="card-title">titulo: ${mensaje.titulo}</h5>
          <p class="card-text">descripcion: ${mensaje.descripcion}</p>
          <p class="card-text">precio: ${mensaje.precio}</p>
          <p class="card-text">codigo: ${mensaje.codigo}</p>
          <p class="card-text">stock: ${mensaje.stock}</p>
          <p class="card-text">estado: ${mensaje.status}</p>
          <p class="card-text">categoria: ${mensaje.categoria}</p>
        </div>
      </div>
    </div>
  </div>`;
  });
});
