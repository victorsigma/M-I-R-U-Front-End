import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Photo } from 'src/app/models/photo';
import { DataSetService } from 'src/app/services/data-set.service';

@Component({
  selector: 'app-see-dataset',
  templateUrl: './see-dataset.component.html',
  styleUrls: ['./see-dataset.component.css']
})
export class SeeDatasetComponent {
  public isMobile: boolean = false;

  public photosList: Array<Photo> = [];
  private skip: number = 0;
  public all: boolean = false;
  public searchTerm: string = '';
  public gender: string = '';
  public age: string = '';
  constructor(private breakpointObserver: BreakpointObserver, private dataSetService: DataSetService) {
    this.breakpointObserver.observe('(max-width: 992px)')
    .subscribe(result => {
      this.isMobile = result.matches;
    });
    this.dataSetService.getDataSet(this.skip, false).subscribe(
      {
        next: (value) => {
          this.photosList = value;
        },
        complete: () => { },
        error: () => { }
      }
    )
  }


  nextItem() {
    if(this.all) return;
    if(this.searchTerm != '' || this.age != '' || this.gender != '') return;
    this.skip += 30; // Aumenta el salto en 30 en lugar de 1
    this.dataSetService.getDataSet(this.skip, this.all).subscribe({
      next: (value) => {
        if (value.length < 1) {
          this.skip -= 30; // Revierte el salto si no hay suficientes datos
          this.dataSetService.getDataSet(this.skip, this.all).subscribe({
            next: (value) => {
              this.photosList = value;
            },
            error: (err) => {
              console.error(err);
            }
          });
        } else {
          this.photosList = value;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  
  previousItem() {
    if(this.all) return;
    if(this.searchTerm != '' || this.age != '' || this.gender != '') return;
    if (this.skip > 0) {
      this.skip -= 30; // Disminuye el salto en 30 en lugar de 1
      if (this.skip < 0) {
        this.skip = 0; // Asegúrate de que no sea menor que 0
      }
      this.dataSetService.getDataSet(this.skip, this.all).subscribe({
        next: (value) => {
          this.photosList = value;
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  changeMode() {
    this.all = !this.all;
    this.updateList();
  }

  updateList() {
    this.dataSetService.getDataSet(this.skip, this.all).subscribe({
      next: (value) => {
        this.photosList = value;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  clearForms() {
    this.searchTerm = '';
    this.gender = '';
    this.age = '';
  }

  get filteredPhotos(): Photo[] {
    return this.photosList.filter(photo =>
      photo.nombre.includes(this.searchTerm) && 
      photo.sexo.toLowerCase().includes(this.gender.toLowerCase()) && 
      photo.edad.toLowerCase().includes(this.age.toLowerCase())
    );
  }
}
