import * as mysql from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2/promise';
import { Category } from './ModelsTs/categoryModel';
class CategoryModel {
  private db: mysql.Pool;
  constructor() {
    this.db = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'game_db',
      charset: 'utf8',
    });
    console.log('Database connection established');
  }

  async getCategories():Promise<Category[] | null> {
    try {
      const [rows] = await this.db.execute<mysql.RowDataPacket[]>('SELECT * FROM category');
      if(!rows){
         return null
      }else{
        return rows as Category[]
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getCategory(id:number):Promise<Category | null> {
    try {
      const [rows] = await this.db.execute<mysql.RowDataPacket[]>('SELECT * FROM category WHERE id=?', [id]);
      if(!rows){
        return null
      }else{
        return rows[0] as Category;
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  async updateCat(name:string, id:number):Promise<boolean> {
    try {
     const result = await this.db.execute<ResultSetHeader>('UPDATE category SET name=? WHERE id=?', [name, id]);
     if(result[0].affectedRows === 1){
        return false;
     }else{
       return true;
     }
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async insertCat(nombre:string):Promise<number | null>{
    try {
      const [rows] = await this.db.execute<ResultSetHeader>('INSERT INTO category(name) VALUES(?)', [nombre]);
      if(!rows){
        return null
      }else{
        return rows.insertId
      }
    } catch (error) {
      console.error('Error inserting category:', error);
      throw error;
    }
  }

  async deleteCat(id:number):Promise<boolean> {
    try {
      const result = await this.db.execute<ResultSetHeader>('DELETE FROM category WHERE id=?', [id]);
      if(result[0].affectedRows === 1){
           return false;
      }else{
          return true;
      }

    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}

export default CategoryModel;
