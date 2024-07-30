import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SlideMainComponent } from './components/slide-main/slide-main.component';
import { TerminalComponent } from './components/terminal/terminal.component';
import { TestTrainComponent } from './components/test-train/test-train.component';
import { DndImgDirective } from './directives/dnd-img.directive';
import { TrainModelComponent } from './components/train-model/train-model.component';
import { SeeDatasetComponent } from './components/see-dataset/see-dataset.component';
import { SeeGraphsComponent } from './components/see-graphs/see-graphs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadScreenComponent } from './components/load-screen/load-screen.component';
import { FormComponent } from './components/form/form.component';

@NgModule({
  declarations: [
    AppComponent,
    SlideMainComponent,
    TerminalComponent,
    TestTrainComponent,
    DndImgDirective,
    TrainModelComponent,
    SeeDatasetComponent,
    SeeGraphsComponent,
    LoadScreenComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
