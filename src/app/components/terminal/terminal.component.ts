import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent {

  @Input() terminalMessage: string = '';
  public isHidden: boolean = false;

  @ViewChild('resizer') resizer!: ElementRef;
  @ViewChild('terminal') terminal!: ElementRef;
  

  hiddenTerminal() {
    this.isHidden = !this.isHidden;

    if (this.isHidden) {
      this.terminal.nativeElement.style.top = `calc(100vh - 36px)`; // Ajusta según el estado minimizado
    } else {
      this.terminal.nativeElement.style.top = `70vh`; // Ajusta según el estado maximizado
    }
  }

  ngAfterViewInit() {
    this.initResizer();
  }

  initResizer() {
    const resizer = this.resizer.nativeElement;
    const terminal = this.terminal.nativeElement;

    let y: number, h: number;

    function rs_mousedownHandler(e: MouseEvent) {
      y = e.clientY;
      const sbHeight = window.getComputedStyle(terminal).height;
      h = parseInt(sbHeight, 10);

      document.addEventListener('mousemove', rs_mousemoveHandler);
      document.addEventListener('mouseup', rs_mouseupHandler);
    }

    const rs_mousemoveHandler = (e: MouseEvent) => {
      const dy = e.clientY - y;
      const ch = h + dy; // Complete height

      if (e.clientY > -1 && !this.isHidden) { // Minimum height of 100px
        if(e.clientY > 928) {
          this.isHidden = true;
        }
        
        terminal.style.top = `${e.clientY}px`; // Move the resizer along with the terminal
      }
    }

    function rs_mouseupHandler() {
      document.removeEventListener('mousemove', rs_mousemoveHandler);
      document.removeEventListener('mouseup', rs_mouseupHandler);
    }

    resizer.addEventListener('mousedown', rs_mousedownHandler);
  }
}
