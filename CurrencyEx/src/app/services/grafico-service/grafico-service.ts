import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GraficoService {
  constructor(private http: HttpClient) {}

  getSerie(base: string, quote: string, from: string, to: string): Observable<any> {
    return this.http.get(
      `https://api.frankfurter.dev/v1/${from}..${to}?base=${base}&symbols=${quote}`
    );
  }
}
