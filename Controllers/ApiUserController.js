const UserModel = require("../Models/UserModel"); // Asegúrate de importar el modelo adecuado
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
class ApiUserController {
  constructor() {
    this.model = new UserModel();
  }

  defaultMethod(res) {
    res.status(404).json({ message: "Error: Ruta no encontrada." });
  }

  async verifyRegister(req, res) {
    const body = req.body;
    if (body) {
      const newNombre = body.name;
      const newGmail = body.gmail;
      const newPassword = body.password;
      const newRol = body.rol;
      try {
        const hashedPassword = await this.hashPassword(newPassword);
        const lastInsertId = this.model.insertUser(
          newNombre,
          newGmail,
          hashedPassword,
          newRol
        );
        if (lastInsertId) {
          res
            .status(200)
            .json({ message: "El Usuario Se Registró Correctamente" });
        } else {
          res.status(500).json({ message: "No se pudo lograr Registrar" });
        }
      } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ message: "Hubo un error al crear el usuario" });
      }
    }
  }

 
async verifyLogin(req, res) {
  try {
    const body = req.body;
    console.log(body);
    if (body) {
      const gmail = body.email;
      const password = body.password;
      const user = await this.model.getUserForGmail(gmail);
      if (user && (await this.verifyPassword(password, user.password))) {
        const token = jwt.sign({ user }, 'tu_secreto_secreto', { expiresIn: '1h' });
        res.status(200).json({ token, user });
      } else {
        res.status(401).json({ message: "Usuario o contraseña incorrectos" });
      }
    } else {
      res.status(400).json({ message: "Datos de inicio de sesión no proporcionados" });
    }
  } catch (error) {
    console.error("Error verifying login:", error);
    res.status(500).json({ message: "Error al verificar el inicio de sesión" });
  }
}

  async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(enteredPassword, hashedPassword) {
    return bcrypt.compare(enteredPassword, hashedPassword);
  }

  logout(req, res) {
    req.session.destroy();
    res.status(200).json({ message: "Cierre de sesión exitoso" });
  }

  getBody(req) {
    return req.body;
  }
}

module.exports = ApiUserController;
