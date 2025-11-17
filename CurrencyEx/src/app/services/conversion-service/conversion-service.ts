import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConversionService {
  constructor(private http: HttpClient) {}

  getConversion(valuta: string, valuteA: string[]): Observable<any> {
    console.log("👉 getConversion() è stata chiamata");
    if (!valuteA || valuteA.length === 0) {
      console.warn("⚠️ Nessuna valuta selezionata, richiesta non inviata.");
      return new Observable(observer => {
        observer.next({ rates: {} });
        observer.complete();
      });
    }

    const symbols = valuteA.join(',').toUpperCase();

    // Costruiamo il link
    const url = `https://api.frankfurter.dev/v1/latest?base=${valuta}&symbols=${symbols}`;

    // 🔍 Print del link completo
    console.log("🌐 Link API generato:", url);

    return this.http.get(url);
  }
}
