import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ModelsService } from 'src/app/services/models.service';
import { TerminalService } from '../../services/terminal.service';
import allUndefined from 'src/app/validators/allUndefined';

@Component({
  selector: 'app-train-model',
  templateUrl: './train-model.component.html',
  styleUrls: ['./train-model.component.css']
})
export class TrainModelComponent {

  public form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z0-9]+$/)]),
    gender: new FormControl(true),
    age: new FormControl(true),
    color: new FormControl(true)
  }, [allUndefined('gender', 'age', 'color') as ValidatorFn])

  public isTrain: boolean = false;

  public gender: boolean = true;
  public age: boolean = true;
  public color: boolean = true;

  constructor(private modelService: ModelsService, private terminalService: TerminalService) { }

  trainModel() {
    if(this.form.valid) {
      const name = this.form.get('name')?.value;
      this.isTrain = true;
      const labels: string[] = [];
      if(this.form.get('gender')?.value) labels.push('sexo');
      if(this.form.get('age')?.value) labels.push('edad');
      if(this.form.get('color')?.value) labels.push('color_piel');

      console.log(labels);
      this.modelService.trainModel(name, labels).subscribe({
        next: (value) => {
          this.isTrain = false;
          this.terminalService.emitEvent('§bInformación: Entrenamiento completado');
        },
        complete: () => {
          this.isTrain = false;
        },
        error: (err) => {
          this.isTrain = false;
          this.terminalService.emitEvent(`§cError: ${err.message}`);
        }
      })
    } else {
      this.terminalService.emitEvent('§6Advertencia: El formulario no cumple las validaciones');
    }
  }
}
