import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {

  private terminalMessage = new EventEmitter<any>();

  get eventEmitter() {
    return this.terminalMessage.asObservable();
  }

  emitEvent(event: any) {
    this.terminalMessage.emit(event);
  }
}
