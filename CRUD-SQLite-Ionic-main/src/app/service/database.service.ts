import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  
  databaseObj: SQLiteObject;
  tables = {
    estudiantes: "estudiantes",
  };
  
  constructor(private sqlite: SQLite) {}

  async createDatabase() {
    // Devuelve la promesa para que el llamador pueda encadenar 'then'
    return this.sqlite
      .create({
        name: "proyecto_crud.db",
        location: "default",
      })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
        return this.createTables(); // Asegúrate de que también devuelva la promesa de crear tablas
      })
      .catch((e) => {
        alert("error on creating database " + JSON.stringify(e));
        throw e; // Lanza el error para que pueda ser manejado en el llamador
      });
  }
  

  async createTables() {
    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.estudiantes} (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        cedula VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        carrera VARCHAR(255) NOT NULL,
        cursado VARCHAR(255) NOT NULL
        )`,
      []
    );

  }

  async addEstudiante(cedula: string, name: string, carrera: string, cursado: string) {


    if (!this.databaseObj) {
      await this.createDatabase(); // Asegúrate de que la base de datos se inicialice
    }

    // Verificar si la cédula ya existe
    const existingCategory = await this.databaseObj.executeSql(
      `SELECT * FROM ${this.tables.estudiantes} WHERE cedula = ?`,
      [cedula]
    );
  
    if (existingCategory.rows.length > 0) {
      return "Error cédula ya está registrada!!";
    }
  
    // Insertar nuevo estudiante
    return this.databaseObj
      .executeSql(
        `INSERT INTO ${this.tables.estudiantes} (cedula, name, carrera, cursado) 
        VALUES (?, ?, ?, ?)`,
        [cedula, name, carrera, cursado]
      )
      .then(() => {
        return "Estudiante registrado con éxito!!";
      })
      .catch((e) => {
        return "error al crear estudiantes" + JSON.stringify(e);
      });
  }

  async getEstudiantes() {
    return this.databaseObj
      .executeSql(
        `SELECT * FROM ${this.tables.estudiantes}`,
        []
      )
      .then((res) => {
        return res;
      })
      .catch((e) => {
        return "Error al obtener estudiantes" + JSON.stringify(e);
      });
  }
  
  async searchEstudiante( cedula: string ) {
    return this.databaseObj
      .executeSql(
        `SELECT * FROM ${this.tables.estudiantes} WHERE cedula LIKE '${cedula}%'`,
        []
      )
      .then((res) => {
        return res;
      })
      .catch((e) => {
        return "Error al obtener estudiantes" + JSON.stringify(e);
      });
  }

  async deleteEstudiante(id: number) {
    return this.databaseObj
      .executeSql(`DELETE FROM ${this.tables.estudiantes} WHERE id = ${id}`, [])
      .then(() => {
        return "Estudiante eliminado";
      })
      .catch((e) => {
        return "Error al eliminar estudiante" + JSON.stringify(e);
      });
  }
  
  async editEstudiante(name: string, id: number, cedula:string, carrera:string, cursado:string) {
    return this.databaseObj
      .executeSql(
        `UPDATE ${this.tables.estudiantes} SET cedula = '${cedula}', name = '${name}', carrera = '${carrera}', cursado = '${cursado}'
         WHERE id = ${id}`,
        []
      )
      .then(() => {
        return "Datos actualizados!!";
      })
      .catch((e) => {
        if (e.code === 6) {
          return "Estudiante ya existe";
        }
        return "error actualizando estudiante" + JSON.stringify(e);
      });
  }

}
