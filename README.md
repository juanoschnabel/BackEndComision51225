<!DOCTYPE html>
<html>
<h1>Plantilla Modelo de Ecommerce</h1>
<p><strong>Descripción breve:</strong> Es un modelo de ecommerce con todas las funcionalidadaes básicas. Cuenta con tres tipos de usuarios distintos con funciones distintas entre si. Utiliza una base de datos de MongoDB.</p>
<h2>Requisitos Previos</h2>
<h4>Node.js versión 18.15.0</h4>
<h4>Base de datos MongoDBinstalada y configurada</h4>
<h2>Dependencias utilizadas:</h2>
<p>-"@faker-js/faker": "^8.0.2"-</p>
<p>-"bcrypt": "^5.1.0"-</p>
<p>-"commander": "^11.0.0"-</p>
<p>-"compression": "^1.7.4"-</p>
<p>-"connect-mongo": "^5.0.0"-</p>
<p>-"cookie-parser": "^1.4.6"-</p>
<p>-"cors": "^2.8.5"-</p>
<p>-"dotenv": "^16.0.3"-</p>
<p>-"express": "^4.18.2"-</p>
<p>-"express-compression": "^1.0.2"-</p>
<p>-"express-handlebars": "^7.0.7"-</p>
<p>-"express-session": "^1.17.3"-</p>
<p>-"jsonwebtoken": "^9.0.0"-</p>
<p>-"luxon": "^3.4.3"-</p>
<p>-"mongoose": "^7.2.1"-</p>
<p>-"mongoose-paginate-v2": "^1.7.1"-</p>
<p>-"multer": "^1.4.5-lts.1"-</p>
<p>-"nodemailer": "^6.9.3"-</p>
<p>-"passport": "^0.6.0"-</p>
<p>-"passport-github2": "^0.1.12"-</p>
<p>-"passport-google-oauth20": "^2.0.0"-</p>
<p>-"passport-local": "^1.0.0"-</p>
<p>-"session-file-store": "^1.5.0"-</p>
<p>-"socket.io": "^4.6.1"-</p>
<p>-"stripe": "^13.6.0"-</p>
<p>-"swagger-jsdoc": "^6.2.8"-</p>
<p>-"swagger-ui-express": "^5.0.0"-</p>
<p>-"winston": "^3.10.0"-</p>
<h3>Dependencias de desarrollo:</h3>
<p>-"nodemon": "^2.0.22"-</p>
<h2>Instalación</h2>
<p>Clonar el proyecto desde el repositorio público de Github. Puedes copiar el link desde aquí ("https://github.com/juanoschnabel/BackEndComision51225.git"). Luego posicionate en la carpeta deseada e inicia una consola. Allí ingrese el comando "git clone https://github.com/juanoschnabel/BackEndComision51225.git". Una vez finalizado el proceso inicie el VSC en el directorio. Abra una terminal y ejecute el comando "npm i". De esta forma tendrás el proyecto listo para iniciar.</p>
<h2>Usuarios</h2>
<h3>Tipos de Usuarios</h3>
<p>Existen tres tipos de usuarios diferentes y cada uno tiene diferentes tipos de funciones</p>
<h4>User</h4>
<p>El usuario de tipo user es el que puede solo comprar productos. Como tal, solo puede gestionar su carrito de compras, interactuar con el chat de la aplicación y realizar el proceso de compra completo. Este usuario es el que se genera por default al registrarse con Google.</p>
<h4>Premium</h4>
<p>El usuario premium es el que puede comprar y vender productos dentro de la plataforma. Tiene atribuciones que le permiten gestionar su carrito de compras, realizar el proceso de compra completo y gestionar sus productos, pudiendo publicar productos nuevos en la plataforma y eliminar sus productos de la base de datos. Como comprador, no puede agregar al carrito los productos que el mismo crea en la base de datos.</p>
<h4>Admininstrador</h4>
<p>Este tipo de usuario es el que gestiona la aplicación a nivel general. No puede realizar el proceso de compra, pero puede gestionar los usuarios (puede eliminarlos o asignarle nuevos roles), los productos (puede crear y eliminar) y los carritos de toda la base de datos (cargarlos de productos, crear carritos o eliminarlos). Este usuario se genera automáticamente al ingresar con Github o puede seleccionarlo desde el proceso manual de registro del usuario ("https://backendcomision51225-production.up.railway.app/sessions/register").</p>
<h2>Registro y Login</h2>
<h4>Registro Local</h4>
<p>Puedes realizar el proceso de registro de manera manual, completando el formulario que se encuentra aquí ("https://backendcomision51225-production.up.railway.app/sessions/register"). En dicho formulario puedes elegir el tipo de rol que quieres que tenga tu usuario.</p>
<h4>Login Local</h4>
<p>Puedes realizar el proceso de login de manera manual, completando el formulario que se encuentra aquí ("https://backendcomision51225-production.up.railway.app/sessions/login").</p>
<h4>Login y Registro de terceros</h4>
<p>Puedes realizar el proceso de login y registro de manera automática, dandole click a los botones correspondientes que se encuentran aquí ("https://backendcomision51225-production.up.railway.app/sessions/login"). Este proceso te creará un usuario en caso de que no lo tengas o te logueará en caso de que ya exista un usuario creado en nuestra base de datos.</p>
<h2>Carrito de compras</h2>
<p>El carrito de compras se genera automáticamente con la creación de cada usuario. Además, cada usuario puede eliminar productos añadidos allí. Cuando el proceso de compra se realiza exitosamente el carrito se vacía y queda listo para una nueva compra.</p>
<h2>Uso</h2>
<p>La aplicación tiene una vista intuitiva que permite realizar un proceso clásico de compra de manera sencilla y efectiva. El proceso se realiza de manera completa, realizandose un ticket que se almacena en la base de datos y un email que se envía al comprador con el detalle de la compra realizada.</p>
<h2>Contacto</h2>
<p>juanmschnabel@gmail.com</p>
<h2>Estado del Proyecto</h2>
<p>La aplicación está en desarrollo activo.</p>
<h2>Notas Adicionales</h2>
<p>Para ingresar a las rutas especificadas en la consigna se debe forzar en la URL la siguiente dirección ("https://backendcomision51225-production.up.railway.app/api/users"). Esto nos redirigirá a una vista donde podremos ver todos los usuarios registrados en la base de datos. Además tenemos el botón "Eliminar usuarios vencidos". Dicho botón elimina de la base de datos a todos los usuarios que hayan pasado mas de dos horas sin loguearse en la aplicación y les envía un mail informandoles de la acción realizada.</p>
</body>
</html>
