import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ModelsService } from 'src/app/services/models.service';
import { TerminalService } from 'src/app/services/terminal.service';
import { TextFormattingService } from 'src/app/services/text-formatting.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-slide-main',
  templateUrl: './slide-main.component.html',
  styleUrls: ['./slide-main.component.css']
})
export class SlideMainComponent {
  public isMobile: boolean = false;
  public sliderLeftStyle: boolean = false;
  public sliderRightStyle: boolean = false;

  public modelsList: Array<any> = [];
  private skip: number = 0;

  public model: string = '...';

  
  public terminalMessageOriginal: string = '§fTerminal Iniciada'
  public terminalMessage: string = '§fTerminal Iniciada'

  public showPanel: boolean = false;


  @ViewChild('terminal') terminal!: any;
  constructor(private breakpointObserver: BreakpointObserver, private modelService: ModelsService, 
    private terminalService: TerminalService, private textFormattingService: TextFormattingService,
    private router: Router) {
    this.breakpointObserver.observe('(max-width: 992px)')
    .subscribe(result => {
      this.isMobile = result.matches;
    });
    this.getModels();
  }

  ngOnInit() {
    this.terminalMessage = this.textFormattingService.formatText(this.terminalMessageOriginal);
    this.terminalService.eventEmitter.subscribe(event => {
      // Inserta el nuevo mensaje al principio de terminalMessage
      
      
      if(this.terminal.isHidden) {
        document.getElementById('terminalHidden')?.click();
      }
      this.terminalMessageOriginal = `${event}\n\n${this.terminalMessageOriginal}`
      this.terminalMessage = this.textFormattingService.formatText(this.terminalMessageOriginal);
    });

    this.router.events.subscribe((value: any) => {
      if(this.router.url == '/form') {
        this.showPanel = false;
      } else {
        
        this.showPanel = true;
      }
    })
  }

  sliderLeftChange() {
    this.sliderLeftStyle = !this.sliderLeftStyle;
  }

  sliderRightChange() {
    this.sliderRightStyle = !this.sliderRightStyle;
  }

  getModels() {
    this.modelService.getModelList(this.skip).subscribe({
      next: (value) => {
        this.modelsList = value;
      },
      complete: () => {
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  selectModel(model: string) {
    this.model = model;
    this.modelService.setSelectModel(model);
  }

  nextItem() {
    this.skip += 4; // Aumenta el salto en 30 en lugar de 1
    this.modelService.getModelList(this.skip).subscribe({
      next: (value) => {
        if (value.length < 1) {
          this.skip -= 4; // Revierte el salto si no hay suficientes datos
          this.modelService.getModelList(this.skip).subscribe({
            next: (value) => {
              this.modelsList = value;
            },
            error: (err) => {
              console.error(err);
            }
          });
        } else {
          this.modelsList = value;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  previousItem() {
    if (this.skip > 0) {
      this.skip -= 4; // Disminuye el salto en 30 en lugar de 1
      if (this.skip < 0) {
        this.skip = 0; // Asegúrate de que no sea menor que 0
      }
      this.modelService.getModelList(this.skip).subscribe({
        next: (value) => {
          this.modelsList = value;
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
}
