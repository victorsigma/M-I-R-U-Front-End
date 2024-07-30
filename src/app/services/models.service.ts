import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Prediction } from '../models/prediction';
import { Graph } from '../models/graph';

@Injectable({
  providedIn: 'root'
})
export class ModelsService {
  private myAppUrl = environment.apiKey;
  private myApiUrl = 'models';
  private myApiUrlTrain = 'train_model';
  private myApiUrlTest = 'predict';
  private myApiUrlPhoto = 'photos';
  private model: string = '';

  constructor(private http: HttpClient) { }


  public getModelList(skip: number): Observable<any> {
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}?skip=${skip}&limit=4`);
  }

  public getModelGraph(): Observable<Graph[]> {
    return this.http.get<Graph[]>(`${this.myAppUrl}${this.myApiUrl}?all=true`);
  }

  public trainModel(name: string, listLabel: string[]): Observable<any> {
    let labels = '?';
    listLabel.forEach((value, index) => {
      if(index == 0) labels = `${labels}labels=${value}`
      else labels = `${labels}&labels=${value}`
    })
    const body = {
      "model_name": name
    }
    return this.http.post(`${this.myAppUrl}${this.myApiUrlTrain}${labels}`, body);
  }

  public testModel(file: File): Observable<Prediction> {
    const fd = new FormData()
    fd.append('model_name', this.model);
    fd.append('file', file);

    return this.http.post<Prediction>(`${this.myAppUrl}${this.myApiUrlTest}`, fd);
  }

  public sendPhoto(form: any, file: File): Observable<any> {
    const fd = new FormData()
    fd.append('nombre', form.name);
    fd.append('sexo', form.gender);
    fd.append('edad', form.age);
    fd.append('color_piel', form.color);
    fd.append('file', file);

    return this.http.post(`${this.myAppUrl}${this.myApiUrlPhoto}`, fd);
  }

  public getStadistics(): Observable<any> {
    return this.http.get(`${this.myAppUrl}${this.myApiUrlPhoto}/statistics`);
  }

  public setSelectModel(model: string) {
    this.model = model;
  }

  public powerOnServer(): Observable<any> {
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}?skip=0&limit=1`);
  }
}
