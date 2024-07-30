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

  constructor(private modelService: ModelsService, private terminalService: TerminalService) { }

  public changeIconDrop(file: File) {
    this.isTest = true;
    let image: any;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      image = reader.result;
    };
    this.modelService.testModel(file).subscribe({
      next: (value) => {
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

        
        this.terminalService.emitEvent(`§bInformación: Predición obtenida`);
        this.terminalService.emitEvent(`<img src="${image}" class="card-img-top-terminal">`);
      },
      complete: () => {
        this.isTest = false;
      },
      error: (err) => {
        this.isTest = false;
        this.terminalService.emitEvent(`§cError: ${err.message}`);
      }
    });
  }

  public readPhoto(event: any) {
    const ev: HtmlInputEvent = event;
    if(ev.target.files && ev.target.files[0]) {
      const file = ev.target.files[0] as File;
      let image: any;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        image = reader.result;
      };

      this.isTest = true;
      this.modelService.testModel(file).subscribe({
        next: (value) => {
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

          
          this.terminalService.emitEvent(`§bInformación: Predición obtenida`);
          this.terminalService.emitEvent(`<img src="${image}" class="card-img-top-terminal">`);
          this.photoInput.nativeElement.value = '';
        },
        complete: () => {
          this.isTest = false;
          this.photoInput.nativeElement.value = '';
        },
        error: (err) => {
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
