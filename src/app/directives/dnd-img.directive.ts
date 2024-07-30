import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[dropZoneImg]'
})
export class DndImgDirective {

  @HostBinding('class.bg-btn-hover') fileOver: boolean = false;

  @Output() changeIconDrop: EventEmitter<File> = new EventEmitter<File>();

  private selectedFile: File | undefined = undefined;

  constructor() { }
  @HostListener('dragover', ['$event']) onDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event']) onDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    this.fileOver = false;
  }


  @HostListener('drop', ['$event']) onDrop(e: any): any {
    e.preventDefault();
    e.stopPropagation();
    this.fileOver = false;
    const files = e.dataTransfer.files;

    if(files.length != 1) return console.warn('The number of files is not valid')
    const file = files[0];
    if(!file.name.endsWith('png') && !file.name.endsWith('jpg') && !file.name.endsWith('jpeg') && !file.name.endsWith('jfif')) return console.warn('Invalid file format')

    this.selectedFile = file;
    this.changeIconDrop.emit(this.selectedFile);
  }
}
