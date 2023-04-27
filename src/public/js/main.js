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
// const cards = document.getElementById("producto");
// let productos;

// form.addEventListener("submit", (event) => {
//   event.preventDefault();
//   socket.emit("mensaje", {
//     titulo: titulo.value,
//     descripcion: descripcion.value,
//     precio: precio.value,
//     categoria: categoria.value,
//     stock: stock.value,
//     status: status.value,
//     imagen: imagen.value,
//     codigo: codigo.value,
//     products: productos,
//   });
//   // limpiar los campos después de enviar el formulario
//   titulo.value = "";
//   descripcion.value = "";
//   precio.value = "";
//   categoria.value = "";
//   stock.value = "";
//   status.value = "";
//   imagen.value = "";
//   codigo.value = "";
// });

// socket.on("productos", (arrayProductos) => {
//   cards.innerHTML = "";
//   arrayProductos.forEach((producto) => {
//     cards.innerHTML += `<div class="card-group d-flex">
//     <div class="row row-cols-12">
//       <div class="card">
//         <div class="text-center">
//           <source srcset="..." type="image/svg+xml" />
//           <img
//             class="img-fluid img-thumbnail"
//             src=${producto.thumbnail}
//             alt="Imagen del producto"
//           /></div>
//         <div class="card-body">
//           <h5 class="card-title">titulo: ${producto.title}</h5>
//           <p class="card-text">descripcion: ${producto.description}</p>
//           <p class="card-text">precio: ${producto.price}</p>
//           <p class="card-text">codigo: ${producto.code}</p>
//           <p class="card-text">stock: ${producto.stock}</p>
//           <p class="card-text">estado: ${producto.status}</p>
//           <p class="card-text">categoria: ${producto.category}</p>
//         </div>
//       </div>
//     </div>
//   </div>`;
//   });
// });
const socket = io();
const title = document.getElementById("titulo");
const description = document.getElementById("descripcion");
const price = document.getElementById("precio");
const category = document.getElementById("categoria");
const stock = document.getElementById("stock");
const status = document.getElementById("status");
const thumbnail = document.getElementById("imagen");
const code = document.getElementById("codigo");
const form = document.getElementById("form");
const cards = document.getElementById("producto");
let productoIngresado = [];

const actualizarListaProductos = (arrayProductos) => {
  cards.innerHTML = "";
  arrayProductos.forEach((producto) => {
    cards.innerHTML += `      <div class="card">
    <div class="text-center">
      <source srcset="..." type="image/svg+xml" />
      <img
        src=${producto.thumbnail}
        class="img-fluid img-thumbnail"
        alt="Imagen del producto"
      /></div>
    <div class="card-body">
      <h5 class="card-title">titulo: ${producto.title}</h5>
      <p class="card-text">descripcion: ${producto.description}</p>
      <p class="card-text">precio: ${producto.price}</p>
      <p class="card-text">codigo: ${producto.code}</p>
      <p class="card-text">stock: ${producto.stock}</p>
      <p class="card-text">estado: ${producto.status}</p>
      <p class="card-text">categoria: ${producto.category}</p>
      <p class="card-text">id: ${producto.id}</p>
    </div>
  </div>`;
  });
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const nuevoProducto = {
    title: title.value,
    description: description.value,
    price: price.value,
    thumbnail: thumbnail.value,
    code: code.value,
    status: status.value,
    stock: stock.value,
    category: category.value,
  };
  productoIngresado.push(nuevoProducto);
  socket.emit("productoIngresado", productoIngresado);
  productoIngresado = [];
});

socket.on("nuevosproductos", (arrayProductos) => {
  // console.log(arrayProductos);
  actualizarListaProductos(arrayProductos);
});
