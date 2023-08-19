const mysql = require('mysql2/promise');

class GameModel {
  constructor() {
    this.db = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'game_db',
      charset: 'utf8',
    });
    console.log('Database connection established'); // Agrega este log
  }
  
  async getGames() {
    try {
      const [rows] = await this.db.execute('SELECT * FROM juegos');
      return rows;
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  }
  

  async getGame(id) {
    try {
      const [rows] = await this.db.execute('SELECT * FROM juegos WHERE id=?', [id]);
      return rows;
    } catch (error) {
      console.error('Error fetching game:', error);
      throw error;
    }
  }

  async insertGame(name, releaseDate, description, price, mainImage, downloadLink, category) {
    try {
      const [result] = await this.db.execute(
        'INSERT INTO juegos(name, releaseDate, description, price, mainImage, downloadLink, fk_id_category) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, releaseDate, description, price, mainImage, downloadLink, category]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error inserting game:', error);
      throw error;
    }
  }

  async updateGame(id, name, releaseDate, description, price, mainImage, downloadLink, category) {
    try {
      await this.db.execute(
        'UPDATE juegos SET name=?, releaseDate=?, description=?, price=?, mainImage=?, downloadLink=?, fk_id_category=? WHERE id=?',
        [name, releaseDate, description, price, mainImage, downloadLink, category, id]
      );
      return true;
    } catch (error) {
      console.error('Error updating game:', error);
      throw error;
    }
  }

  async deleteGame(id) {
    try {
      await this.db.execute('DELETE FROM juegos WHERE id=?', [id]);
    } catch (error) {
      console.error('Error deleting game:', error);
      throw error;
    }
  }
}

module.exports = GameModel;
