import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoricoService {
  constructor(private http: HttpClient) {}

  /*Per le valute divese (default è EUR)*/
  getConversion(valuta: string, date: string): Observable<any> {
  if (!date) {
    throw new Error("Data mancante");
  }
    return this.http.get(`https://api.frankfurter.dev/v1/${date}?base=${valuta}`);
  }
}
