import * as mysql from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2/promise';
import {Game} from '../Models/ModelsTs/gameModel';
class GameModel {
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
  
  async getGames(): Promise<Game[] | null> {
    try {
      const [rows] = await this.db.execute<mysql.RowDataPacket[]>('SELECT * FROM juegos');
      if(!rows){
        return null
      }else{
        return rows as Game[];
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  }

  async getGame(id: number): Promise<Game | null>{
    try {
      const [row] = await this.db.execute<mysql.RowDataPacket[]>('SELECT * FROM juegos WHERE id=?', [id]);
      if(!row[0]){
        return null
      }else{
        return row[0] as Game;
      }
    } catch (error) {
      console.error('Error fetching game:', error);
      throw error;
    }
  }
  
  async insertGame(
    name: string,
    releaseDate: string,
    description: string,
    price: number,
    mainImage: string,
    downloadLink: string,
    category: number
  ): Promise<number> {
    try {
      const [result] = await this.db.execute<ResultSetHeader>(
        'INSERT INTO juegos(name, releaseDate, description, price, mainImage, downloadLink, fk_id_category) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, releaseDate, description, price, mainImage, downloadLink, category]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error inserting game:', error);
      throw error;
    }
  }
    
  async updateGame(
    id: number,
    name: string,
    releaseDate: string,
    description: string,
    price: number,
    mainImage: string,
    downloadLink: string,
    category: number
  ): Promise<boolean> {
    try {
      const result = await this.db.execute<ResultSetHeader>(
        'UPDATE juegos SET name=?, release_date=?, description=?, price=?, main_image=?, download_link=?, fk_id_category=? WHERE id=?',
        [name, releaseDate, description, price, mainImage, downloadLink, category, id]
      );
  
      if (result[0].affectedRows === 1) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error updating game:', error);
      throw error;
    }
  }

  async deleteGame(id: number): Promise<boolean> {
    try {
      const result = await this.db.execute<ResultSetHeader>(
        'DELETE FROM juegos WHERE id=?', [id]
      );
  
      if (result[0].affectedRows === 1) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error deleting game:', error);
      throw error;
    }
  }
}

export default GameModel;
