import bcrypt from "bcrypt";
//Encripta contraseña
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)));

//Desencriptar la contraseña
export const validatepassword = (passwordSend, passwordBDD) =>
  bcrypt.compareSync(passwordSend, passwordBDD);
const passwordEncriptado = createHash("coderhouse");
console.log(passwordEncriptado);
console.log(validatepassword("coderhouse", passwordEncriptado));
