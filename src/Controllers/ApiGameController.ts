import { Request, Response} from 'express';
import { admin } from '../firebaseConfig';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import GameModel from '../Models/GameModel';

class ApiGameController {
  private model: GameModel;

  constructor() {
    this.model = new GameModel();
  }

  defaultMethod(res: Response) {
    this.sendResponse(res,404,{ message: "Error: Ruta no encontrada." });
  }

  async getGames(res: Response) {
    try {
      const games = await this.model.getGames();
      if (games) {
        this.sendResponse(res,200,games);
      } else {
        this.sendResponse(res,404,{ message: "No se encontraron juegos" });
      }
    } catch (error) {
       this.sendResponse(res,500,{message:"Error al obtener los juegos"});
    }
  }

  async getGame(req: Request, res: Response) {
    try {
      const id:number = Number(req.params.ID); // Convertir el parámetro a número
      if (isNaN(id)) {
        this.sendResponse(res,400, {message: "El ID del juego no es válido"});
        return;
      }
      const game = await this.model.getGame(id);
      if (game) {
        this.sendResponse(res,200,game);
      } else {
        this.sendResponse(res,404,{message:"El juego no existe"});
      }
    } catch (error) {
      this.sendResponse(res,500,{ message: "Error al obtener el juego" });
    }
  }
  

  async deleteGame(req: Request, res: Response) {
    try {
      const id:number = Number(req.params.ID);
      const game = await this.model.getGame(id);
      if (game) {
        const imageUrl = game.mainImage;
        if (imageUrl) {
          await this.deleteImageFromFirebaseStorage(imageUrl);
        }
        await this.model.deleteGame(id);
        this.sendResponse(res,200, { message:"El juego se eliminó" });
      } else {
        this.sendResponse(res,404, { message:"El juego no se eliminó porque no existe en la base de datos"});
      }
    } catch (error) {
        this.sendResponse(res,500,{message:"Error al eliminar el juego"});
    }
  }

  async updateGame(req: Request, res: Response) {
    try {
      const id:number = Number(req.params.ID);
      const body = req.body;
      const mainImage:string = body.mainImage;
      const game = await this.model.getGame(id);
      if(game){
        const imageUrl = game.mainImage;
        await this.deleteImageFromFirebaseStorage(imageUrl);
      }
      if (game) {
        const token = await this.uploadImageToFirebaseStorage(mainImage);
        await this.model.updateGame(id, body.name, body.releaseDate, body.description, body.price, token, body.downloadLink, body.category);
        this.sendResponse(res,200,{message:"El juego se actualizó correctamente"});
      } else {
        this.sendResponse(res,404,{message:"El juego no se pudo actualizar correctamente"});
      }
    } catch (error) {
      console.error("Error updating game:", error);
      this.sendResponse(res,500,{message:"Error al actualizar el juego"});
    }
  }

  async insertGame(req: Request, res: Response) {
    try {
      const body = req.body;
      const mainImage = req.file;
      const token = await this.uploadImageToFirebaseStorage(mainImage);
     if(token){
      const id = await this.model.insertGame(
        body.name,
        body.releaseDate,
        body.description,
        body.price,
        token,
        body.downloadLink,
        body.category
      );      
      if (id) {
        this.sendResponse(res, 201, "El juego se insertó correctamente");
      } else {
        this.sendResponse(res, 500, "No se pudo insertar el juego en la base de datos");
      }
    }
    } catch (error) {
      this.sendResponse(res,500,{ message: "Error al insertar el juego" });
    }
  }

  sendResponse(res: Response, status: number, payload?: any) {
    res.status(status).json(payload);
  }

  getBody(req: Request) {
    return req.body;
  }
  
  async deleteImageFromFirebaseStorage(imageUrl: string) {
    try {
      const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
      const bucket = admin.storage().bucket();
      const file = bucket.file(fileName);
      await file.delete();
    } catch (error) {
      throw new Error("Error al eliminar la imagen de Firebase Storage");
    }
  }

  async uploadImageToFirebaseStorage(file: any):Promise<string>{
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
      metadata: metadata,
    };

    return new Promise((resolve, reject) => {
      fileUpload.createWriteStream(options)
        .on('error', (error) => {
          console.error("Error al cargar la imagen:", error);
          reject(error);
        })
        .on('finish', () => {
          const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
          resolve(imageUrl);
        })
        .end(file.buffer);
    });
  }

}
export default ApiGameController;
