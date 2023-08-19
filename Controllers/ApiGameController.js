const GameModel = require('../Models/GameModel');
const { admin } = require('../firebaseConfig');
const { Readable } = require('stream');
const { v4: uuidv4 } = require('uuid');
class ApiGameController {
  constructor() {
    this.model = new GameModel();
  }
  defaultMethod(res) {
    res.status(404).json({ message: "Error: Ruta no encontrada." });
  }
  async getGames(res) {
    try {
      const games = await this.model.getGames();
      if (games && games.length > 0) {
        console.log(games);
        res.status(200).json(games);
      } else {
        res.status(404).json({ message: "No se encontraron juegos" });
      }
    } catch (error) {
      console.error("Error fetching games:", error);
      res.status(500).json({ message: "Error al obtener los juegos" });
    }
  }
  
  async getGame(req, res) {
    try {
      const id = req.params.ID; // Obtener el valor del parámetro "ID" desde la URL
      const game = await this.model.getGame(id);
      if (game && game.length > 0) {
        res.status(200).json(game[0]);
      } else {
        res.status(404).json({ message: "El juego no existe" });
      }
    } catch (error) {
      console.error("Error fetching game:", error);
      res.status(500).json({ message: "Error al obtener el juego" });
    }
  }
  
  async deleteGame(req, res) {
    try {
      const id = req.params.ID;
      console.log(id);
      const game = await this.model.getGame(id);
      if (game && game.length > 0) {
        const imageUrl = game[0].mainImage;
        if (imageUrl) {
          await this.deleteImageFromFirebaseStorage(imageUrl);
        }
       await this.model.deleteGame(id);
       res.status(200).json({ message: "El juego se elimino"});
      } else {
        res.status(404).json({ message: "El juego no se eliminó porque no existe en la base de datos" });
      }
    } catch (error) {
      console.error("Error deleting game:", error);
      res.status(500).json({ message: "Error al eliminar el juego" });
    }
  }  

  async updateGame(req, res) {
    try {
      const id = req.params.ID;
      const body = req.body;
      const game = await this.model.getGame(id);
      const imageUrl = game[0].mainImage;
        if (imageUrl) {
          await this.deleteImageFromFirebaseStorage(imageUrl);
        }
      if (game && game.length > 0) {
        await this.model.updateGame(id, body.name, body.releaseDate, body.description, body.price, token, body.downloadLink, body.category);
        res.status(200).json({ message: "El juego se actualizó correctamente" });
      } else {
        res.status(404).json({ message: "El juego no se pudo actualizar correctamente" });
      }
    } catch (error) {
      console.error("Error updating game:", error);
      res.status(500).json({ message: "Error al actualizar el juego" });
    }
  }
  // Longitud máxima del nombre de archivo permitida
  async deleteImageFromFirebaseStorage(imageUrl) {
    try {
      // Obtener el nombre del archivo desde la URL de acceso de descarga
      const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

      // Eliminar la imagen de Firebase Storage
      const bucket = admin.storage().bucket();
      const file = bucket.file(fileName);
      await file.delete();
    } catch (error) {
      throw new Error("Error al eliminar la imagen de Firebase Storage");
    }
  }
  async uploadImageToFirebaseStorage(file) {
    if (!file.buffer || file.buffer.length === 0) {
      throw new Error("El buffer de la imagen está vacío o no existe.");
    }
  
    const bucket = admin.storage().bucket();
    const uniqueFileName = `${uuidv4()}_${file.originalname}`;
    const fileUpload = bucket.file(uniqueFileName);
  
    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);
  
    const token = uuidv4(); // Generar un nuevo token de acceso
    const metadata = {
      contentType: file.mimetype,
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    };
  
    const options = {
      destination: fileUpload,
      public: true,
      resumable: false,
      metadata: metadata, // Agregar los metadatos al objeto de opciones
    };
  
    // Devolver una promesa que resuelve cuando la carga está completa
    return new Promise((resolve, reject) => {
      // Evento "error" del flujo de escritura
      fileUpload.createWriteStream(options)
        .on('error', (error) => {
          console.error("Error al cargar la imagen:", error);
          reject(error); // Rechazar la promesa en caso de error
        })
        .on('finish', () => {
          // Obtener la URL de la imagen alojada
          const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
          resolve(imageUrl); // Resolver la promesa con la URL de la imagen
        })
        .end(file.buffer); // Finalizar el flujo con los datos del buffer
    });
  }
    
  async insertGame(req, res) {
    try {
      const body = req.body;
      const mainImage = req.file; // Supongo que el middleware multer ya ha procesado la imagen
  
      // Subir la imagen a Firebase Storage y obtener el token de acceso
      const token = await this.uploadImageToFirebaseStorage(mainImage);
  
      // Insertar el juego en la base de datos con el token de acceso
      const id = await this.model.insertGame(
        //  [name, releaseDate, description, price, mainImage, downloadLink, category]
        body.name,
        body.releaseDate,
        body.description,
        body.price,
        token, // Usar el token de acceso
        body.downloadLink,
        body.category
      );
  
      if (id) {
        res.status(201).json({ message: "El juego se insertó correctamente"});
      } else {
        res.status(500).json({ message: "No se pudo insertar el juego en la base de datos" });
      }
    } catch (error) {
      console.error("Error inserting game:", error);
      res.status(500).json({ message: "Error al insertar el juego" });
    }
  }

  getBody(req) {
    return req.body;
  }

}

module.exports = ApiGameController;
