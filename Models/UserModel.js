const mysql = require('mysql2/promise');

class UserModel {
  constructor() {
    this.db = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'game_db',
      charset: 'utf8',
    });
  }

  async getUserForGmail(gmail) {
    try {
      const [rows] = await this.db.execute('SELECT * FROM usuarios WHERE gmail=?', [gmail]);
      return rows[0];
    } catch (error) {
      console.error('Error fetching user by gmail:', error);
      throw error;
    }
  }

  async getUserForId(id) {
    try {
      const [rows] = await this.db.execute('SELECT * FROM usuarios WHERE id=?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error fetching user by id:', error);
      throw error;
    }
  }

  async deleteUserForId(id) {
    try {
      await this.db.execute('DELETE FROM usuarios WHERE id=?', [id]);
    } catch (error) {
      console.error('Error deleting user by id:', error);
      throw error;
    }
  }

  async deleteUserForGmail(gmail) {
    try {
      await this.db.execute('DELETE FROM usuarios WHERE gmail=?', [gmail]);
    } catch (error) {
      console.error('Error deleting user by gmail:', error);
      throw error;
    }
  }

  async updateUserForGmail(id, nombre, gmail, contraseña, rol) {
    try {
      await this.db.execute('UPDATE usuarios SET nombre=?, gmail=?, password=?, rol=? WHERE id=?', [nombre, gmail, contraseña, rol, id]);
    } catch (error) {
      console.error('Error updating user by gmail:', error);
      throw error;
    }
  }

  async updateUserForId(id, nombre, gmail, contraseña, rol) {
    try {
      await this.db.execute('UPDATE usuarios SET name=?, gmail=?, password=?, rol=? WHERE id=?', [nombre, gmail, contraseña, rol, id]);
    } catch (error) {
      console.error('Error updating user by id:', error);
      throw error;
    }
  }

  async insertUser(nombre, gmail, contraseña, rol) {
    try {
      const [result] = await this.db.execute('INSERT INTO usuarios(name, gmail, password, rol) VALUES(?, ?, ?, ?)', [nombre, gmail, contraseña, rol]);
      return result.insertId;
    } catch (error) {
      console.error('Error inserting user:', error);
      throw error;
    }
  }
  async register(){
    try{

    }catch(error){
       
    }
  }
}

module.exports = UserModel;
