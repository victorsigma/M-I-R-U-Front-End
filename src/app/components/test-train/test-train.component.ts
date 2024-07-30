import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModelsService } from 'src/app/services/models.service';
import { TerminalService } from 'src/app/services/terminal.service';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-test-train',
  templateUrl: './test-train.component.html',
  styleUrls: ['./test-train.component.css']
})



export class TestTrainComponent {
  @ViewChild('photo') photoInput!: ElementRef;
  public isTest: boolean = false;
  public options: 'all' | 'only_age' | 'only_color' = 'all';

  constructor(private modelService: ModelsService, private terminalService: TerminalService) { }

  public changeIconDrop(file: File) {
    this.prediction(file);
  }

  public readPhoto(event: any) {
    const ev: HtmlInputEvent = event;
    if(ev.target.files && ev.target.files[0]) {
      const file = ev.target.files[0] as File;
      this.prediction(file);
    }
  }

  private prediction(file: File) {
    let image: any;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      image = reader.result;
    };

    this.isTest = true;
    if(this.options == 'all') {
      this.modelService.testModel(file).subscribe({
        next: (value: any) => {
          this.isTest = false;
          
          if(value.sexo != undefined) {
            this.terminalService.emitEvent(` §bSexo: §6${value.sexo}`);
          }
          if(value.edad != undefined) {
            this.terminalService.emitEvent(` §bEdad: §6${value.edad}`);
          }
          if(value.color_piel != undefined) {
            this.terminalService.emitEvent(` §bColor de piel: §6${value.color_piel}`);
          }
  
          
          this.terminalService.emitEvent(`§bInformación: Predicción General Obtenida`);
          this.terminalService.emitEvent(`<img src="${image}" class="card-img-top-terminal">`);
          this.photoInput.nativeElement.value = '';
        },
        complete: () => {
          this.isTest = false;
          this.photoInput.nativeElement.value = '';
        },
        error: (err: any) => {
          this.isTest = false;
          console.log(err)
          if(err.status == 422) {
            this.terminalService.emitEvent(`§cError: Selecione un modelo`);
          } else {
            this.terminalService.emitEvent(`§cError: ${err.message}`);
          }
          this.photoInput.nativeElement.value = '';
        }
      });
    } else if (this.options == 'only_color') {
      this.modelService.testModelColor(file).subscribe({
        next: (value: any) => {
          this.isTest = false;
          
          for (const item in value.recommendations) {
            this.terminalService.emitEvent(` §a${value.recommendations[item]}`);
          }
          
          
          this.terminalService.emitEvent(`=====================================`);

          if(value.predictions.sexo != undefined) {
            this.terminalService.emitEvent(` §bSexo: §6${value.predictions.sexo}`);
          }
          if(value.predictions.edad != undefined) {
            this.terminalService.emitEvent(` §bEdad: §6${value.predictions.edad}`);
          }
          if(value.predictions.color_piel != undefined) {
            this.terminalService.emitEvent(` §bColor de piel: §6${value.predictions.color_piel}`);
          }
  
          
          this.terminalService.emitEvent(`§bInformación: Recomendación de Ropa Obtenida`);
          this.terminalService.emitEvent(`<img src="${image}" class="card-img-top-terminal">`);
          this.photoInput.nativeElement.value = '';
        },
        complete: () => {
          this.isTest = false;
          this.photoInput.nativeElement.value = '';
        },
        error: (err: any) => {
          this.isTest = false;
          console.log(err)
          if(err.status == 422) {
            this.terminalService.emitEvent(`§cError: Selecione un modelo`);
          } else {
            this.terminalService.emitEvent(`§cError: ${err.message}`);
          }
          this.photoInput.nativeElement.value = '';
        }
      });
    } else {
      this.modelService.testModelAge(file).subscribe({
        next: (value: any) => {
          this.isTest = false;
          
          for (const item in value.puedes_ver) {
            this.terminalService.emitEvent(` §a${value.puedes_ver[item]}`);
          }

          
          this.terminalService.emitEvent(`=====================================`);

          if(value.predictions.edad != undefined) {
            this.terminalService.emitEvent(`§bEdad: §6${value.predictions.edad}`);
          }
          
          this.terminalService.emitEvent(`§bInformación: Filtrado de Contenido Obtenido`);
          this.terminalService.emitEvent(`<img src="${image}" class="card-img-top-terminal">`);
          this.photoInput.nativeElement.value = '';
        },
        complete: () => {
          this.isTest = false;
          this.photoInput.nativeElement.value = '';
        },
        error: (err: any) => {
          this.isTest = false;
          console.log(err)
          if(err.status == 422) {
            this.terminalService.emitEvent(`§cError: Selecione un modelo`);
          } else {
            this.terminalService.emitEvent(`§cError: ${err.message}`);
          }
          this.photoInput.nativeElement.value = '';
        }
      });
    }
  }
}
