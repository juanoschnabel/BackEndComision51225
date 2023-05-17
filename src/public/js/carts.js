const socket = io();
const createCartButton = document.getElementById("createCart");
const cartId = document.getElementById("idCart");
const productId = document.getElementById("idProduct");
const quantity = document.getElementById("quantity");
const formCarts = document.getElementById("formCarts");

createCartButton.addEventListener("click", (e) => {
  e.preventDefault();
  const newCart = [];
  socket.emit("nuevoCarrito", newCart);
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
    title: "Carrito creado exitosamente!",
  });
});

formCarts.addEventListener("submit", (e) => {
  e.preventDefault();
  const parseQuantity = Number(quantity.value);
  const nuewBuy = {
    cartId: cartId.value,
    products: [
      {
        idProduct: productId.value,
        quantity: parseQuantity,
      },
    ],
  };
  console.log(nuewBuy);
});
