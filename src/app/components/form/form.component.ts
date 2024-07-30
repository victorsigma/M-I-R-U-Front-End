import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModelsService } from 'src/app/services/models.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    gender: new FormControl('M'),
    age: new FormControl('infante'),
    color: new FormControl('blanco'),
  })

  file!: File;
  @ViewChild('photo') photo!: ElementRef;
  public page: 'form' | 'image' | 'thanks' | 'error' = 'form';
  
  public isLoading: boolean = true;


  constructor(private modelsService: ModelsService) { 
    this.modelsService.powerOnServer().subscribe({
      next: () => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    })
  }

  // Método para manejar el envío del formulario
  sendForm() {
    this.modelsService.sendPhoto(this.form.value, this.file).subscribe(      {
      next: (value) => {
        this.page = 'thanks';
      },
      complete: () => { },
      error: (error) => {
        console.log(error)
        this.page = 'error';
      }
    })
  }

  // Método para manejar el cambio de archivo
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar el archivo aquí (por ejemplo, verificar el tipo)
      if (file.type.startsWith('image/')) {
        this.file = file;
      } else {
        // Manejar el caso cuando el archivo no es una imagen
        alert('Por favor, seleccione una imagen.');
      }
    }
  }

  // Método para simular el clic en el input file cuando se hace clic en el botón
  triggerFileInput() {
    this.photo.nativeElement.click();
  }

  public changeIconDrop(file: File) {
    this.file = file;
  }

  nextForm() {
    this.page = 'image';
  }
}
