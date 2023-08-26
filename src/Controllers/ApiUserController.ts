import { Request, Response } from "express";
import UserModel from "../Models/UserModel"; // Asegúrate de importar el modelo adecuado
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class ApiUserController {
  private model: UserModel;

  constructor() {
    this.model = new UserModel();
  }

  defaultMethod(res: Response) {
    res.status(404).json({ message: "Error: Ruta no encontrada." });
  }

  async verifyRegister(req: Request, res: Response) {
    if (req.body) {
      try {
        const body = req.body;
        const newPassword = body.password;
        const hashedPassword = await this.hashPassword(newPassword);
        if (hashedPassword) {
          const lastInsertId = await this.model.insertUser(
            body.name,
            body.gmail,
            hashedPassword,
            body.rol
          );
          if (lastInsertId) {
            res
              .status(200)
              .json({ message: "El Usuario Se Registró Correctamente" });
          } else {
            res.status(500).json({ message: "No se pudo lograr Registrar" });
          }
        }
      } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ message: "Hubo un error al crear el usuario" });
      }
    }
  }

  async verifyLogin(req: Request, res: Response) {
    try {
      const body = req.body;
      console.log(body);
      if (body) {
        const gmail:string = body.email;
        const password:string = body.password;
        const user = await this.model.getUserForGmail(gmail);
        if (user && (await this.verifyPassword(password, user.password))) {
          const token = jwt.sign({ user }, "tu_secreto_secreto", {
            expiresIn: "1h",
          });
          res.status(200).json({ token, user });
        } else {
          res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }
      } else {
        res
          .status(400)
          .json({ message: "Datos de inicio de sesión no proporcionados" });
      }
    } catch (error) {
      console.error("Error verifying login:", error);
      res
        .status(500)
        .json({ message: "Error al verificar el inicio de sesión" });
    }
  }

  async hashPassword(password: string) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(enteredPassword: string, hashedPassword: string) {
    return bcrypt.compare(enteredPassword, hashedPassword);
  }

  logout(req: Request, res: Response) {
    res.status(200).json({ message: "Cierre de sesión exitoso" });
  }
}

export default ApiUserController;
