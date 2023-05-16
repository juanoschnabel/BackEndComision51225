const socket = io();
const message = document.getElementById("textArea");
const user = document.getElementById("nombre");
const formMessages = document.getElementById("form");
let mensajeIngresado = [];

formMessages.addEventListener("submit", (e) => {
  e.preventDefault();
  const nuevoMensaje = {
    user: user.value,
    message: message.value,
  };
  if (nombre.value && textArea.value != "") {
    mensajeIngresado.push(nuevoMensaje);
    socket.emit("nuevoMensaje", mensajeIngresado);
    mensajeIngresado = [];
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: "success",
      title: "Mensaje enviado exitosamente!",
    });
  } else {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: "error",
      title: "Faltan completar campos!",
    });
  }
});
