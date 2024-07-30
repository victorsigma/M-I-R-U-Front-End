import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Photo } from '../models/photo';

@Injectable({
  providedIn: 'root'
})
export class DataSetService {

  private myAppUrl = environment.apiKey;
  private myApiUrl = 'photos';
  constructor(private http: HttpClient) { }

  getDataSet(skip: number, all: boolean): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.myAppUrl}${this.myApiUrl}?all=${all}&limit=30&skip=${skip}`);
  }
}
