import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestTrainComponent } from './components/test-train/test-train.component';
import { TrainModelComponent } from './components/train-model/train-model.component';
import { SeeDatasetComponent } from './components/see-dataset/see-dataset.component';
import { SeeGraphsComponent } from './components/see-graphs/see-graphs.component';
import { FormComponent } from './components/form/form.component';

const routes: Routes = [
  {
    component: TestTrainComponent,
    path: 'test-model'
  },
  {
    component: TrainModelComponent,
    path: 'train-model'
  },
  {
    component: SeeDatasetComponent,
    path: 'see-dataset'
  },
  {
    component: SeeGraphsComponent,
    path: 'see-graphs'
  },
  {
    component: FormComponent,
    path: 'form'
  },
  {
    redirectTo: 'form',
    path: '**'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
