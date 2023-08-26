import * as mysql from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2/promise';
import {User} from './ModelsTs/userModel';
class UserModel {
  private db: mysql.Pool;

  constructor() {
    this.db = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'game_db',
      charset: 'utf8',
    });
  }
  
  async getUserForGmail(gmail: string): Promise<User | null> {
    try {
      const [row] = await this.db.execute<mysql.RowDataPacket[]>(
        'SELECT * FROM usuarios WHERE gmail=?', [gmail]
      );

      if (!row[0]) { //A UN QUE ME VENGA UN ARRAY Y YO SEPA QUE ME VA AVENIR UN SOLO OBJETO TENGO QUE PONER [0]
        return null;
      } else {
        const user: User = row[0] as User;
        return user;
      }
    } catch (error) {
      console.error('Error fetching user by gmail:', error);
      throw error;
    }
  }


  async deleteUserForGmail(gmail: string) {
    try {
      const result = await this.db.execute<ResultSetHeader>(
        'DELETE FROM usuarios WHERE gmail=?', [gmail]
      );
  
      if (result[0].affectedRows === 1) {
        console.log('User deleted successfully.');
      } else {
        console.log('User not found or not deleted.');
      }
    } catch (error) {
      console.error('Error deleting user by gmail:', error);
      throw new Error('Error deleting user.');
    }
  }

  async updateUserForGmail(id: number, nombre: string, gmail: string, contraseña: string, rol: string) {
    try {
      const result = await this.db.execute<ResultSetHeader>(
        'UPDATE usuarios SET name=?, email=?, password=?, rol=? WHERE id=?', 
        [nombre, gmail, contraseña, rol, id]
      );
  
      if (result[0].affectedRows === 1) {
        console.log('User updated successfully.');
      } else {
        console.log('User not found or not updated.');
      }
    } catch (error) {
      console.error('Error updating user by gmail:', error);
      throw error;
    }
  }
  
  async insertUser(name: string, gmail: string, password: string, rol: string):Promise<number> {
    try {
      const [result] = await this.db.execute<ResultSetHeader>('INSERT INTO usuarios(name, gmail, password, rol) VALUES(?, ?, ?, ?)', [name, gmail, password, rol]);
      return result.insertId;
    } catch (error) {
      console.error('Error inserting user:', error);
      throw error;
    }
  }

}

export default UserModel;
