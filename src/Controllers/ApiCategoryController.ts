import CategoryModel from '../Models/CategoryModel'; // Asegúrate de importar el modelo adecuado
import { Request, Response } from 'express'; // Importa los tipos para Request y Response
class ApiCategoryController {
  private model: CategoryModel;

  constructor() {
    this.model = new CategoryModel();
  }

  defaultMethod(res: Response) {
    res.status(404).json({ message: "Error: Ruta no encontrada." });
  }

  async getCategories(res: Response) {
    try {
      const categories = await this.model.getCategories();
      res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Error al obtener las categorías" });
    }
  }

  async getCat(req: Request, res: Response) {
    try {
      const id:number = Number(req.params.ID);
      const category = await this.model.getCategory(id);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: "La categoría no se encontró en la base de datos" });
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Error al obtener la categoría" });
    }
  }

  async updateCat(req: Request, res: Response) {
    try {
      const id:number = Number(req.params.ID);
      const category = await this.model.getCategory(id);
      if (category) {
        const body = req.body;
        await this.model.updateCat(body.name, id);
        res.status(200).json({ message: "La categoría fue actualizada correctamente" });
      } else {
        res.status(404).json({ message: "No se encontró la categoría con ese ID" });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Error al actualizar la categoría" });
    }
  }

  async deleteCat(req: Request, res: Response) {
    try {
      const id:number = Number(req.params.ID);
      const category = await this.model.getCategory(id);
      if (category) {
        await this.model.deleteCat(id);
        res.status(200).json({ message: "Se eliminó correctamente la categoría" });
      } else {
        res.status(404).json({ message: "No se puede eliminar porque no existe la categoría" });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Error al eliminar la categoría" });
    }
  }

  async insertCat(req: Request, res: Response) {
    try {
      const body = req.body;
      const id = await this.model.insertCat(body.name);
      if (id) {
        res.status(200).json({ message: "La categoría se insertó correctamente" });
      } else {
        res.status(500).json({ message: "La categoría no se insertó correctamente" });
      }
    } catch (error) {
      console.error("Error inserting category:", error);
      res.status(500).json({ message: "Error al insertar la categoría" });
    }
  }
}

export default ApiCategoryController;
