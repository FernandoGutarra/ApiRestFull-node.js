const mysql = require('mysql2/promise');

class CategoryModel {
  constructor() {
    this.db = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'game_db',
      charset: 'utf8',
    });
  }

  async getCategories() {
    try {
      const [rows] = await this.db.execute('SELECT * FROM category');
      return rows;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getCategory(id) {
    try {
      const [rows] = await this.db.execute('SELECT * FROM category WHERE id=?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  async updateCat(name, id) {
    try {
      await this.db.execute('UPDATE category SET name=? WHERE id=?', [name, id]);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async insertCat(nombre) {
    try {
      const [result] = await this.db.execute('INSERT INTO category(name) VALUES(?)', [nombre]);
      return result.insertId;
    } catch (error) {
      console.error('Error inserting category:', error);
      throw error;
    }
  }

  async deleteCat(id) {
    try {
      await this.db.execute('DELETE FROM category WHERE id=?', [id]);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}

module.exports = CategoryModel;
