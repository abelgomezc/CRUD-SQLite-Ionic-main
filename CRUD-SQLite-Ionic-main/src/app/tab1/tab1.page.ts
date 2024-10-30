import { Component } from '@angular/core';
import { DatabaseService } from '../service/database.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  nombre: string = "";
  cedula: string = "";
  cursado: string = "";
  carrera: string = "";
  estudiantes: any = [];
  editMode: boolean = false;
  editId: number = 0;

  constructor(public database: DatabaseService, public platform: Platform) {
    this.database.createDatabase().then(() => {
      // will call get categories
      this.getEstudiantes();
    });
  }

  ngOnInit() {}

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }


  addEstudiante() {
    if (!this.cedula.trim() || !this.nombre.trim() || !this.carrera.trim() || !this.cursado.trim()) {
  alert('Completa todos los campos');
  return;
}

    if (this.editMode) {
      // edit estudiante
      this.database
        .editEstudiante(this.nombre, this.editId, this.cedula, this.carrera, this.cursado)
        .then((data) => {
          this.cedula = "";
          this.nombre = "";
          this.carrera = "";
          this.cursado = "";
          (this.editMode = false), (this.editId = 0);
          alert(data);
          this.getEstudiantes();
        });
    } else {
      // add estudiante
      this.database.addEstudiante(this.cedula, this.nombre, this.carrera, this.cursado).then((data) => {
        this.cedula = "";
        this.nombre = "";
        this.carrera = "";
        this.cursado = "";
        alert(data);
        this.getEstudiantes();
      });
    }
  }

  getEstudiantes() {
    this.database.getEstudiantes().then((data) => {
      this.estudiantes = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          this.estudiantes.push(data.rows.item(i));
        }
      }
    });
  }

  searchEstudiante(cedula: string) {
    if (cedula) {
      this.database.searchEstudiante(cedula).then((data) => {
        this.estudiantes = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            this.estudiantes.push(data.rows.item(i));
          }
        }
      });
    } else {
      this.getEstudiantes();
    }
  }
  

  deleteEstudiante(id: number) {
    this.database.deleteEstudiante(id).then((data) => {
      alert(data);
      this.getEstudiantes();
    });
  }

  editEstudiante(estudiante: any) {
    this.editMode = true;
    this.cedula = estudiante.cedula;
    this.nombre = estudiante.name;
    this.carrera = estudiante.carrera;
    this.cursado = estudiante.cursado;
    this.editId = estudiante.id;
  }

}
