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
