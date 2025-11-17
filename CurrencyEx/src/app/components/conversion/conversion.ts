import { Component } from '@angular/core';
import { ConversionService } from '../../services/conversion-service/conversion-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-conversion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversion.html',
  styleUrl: './conversion.css',
})
export class Conversion {

  valute = [
    'AUD','BGN','BRL','CAD','CHF','CNY','CZK','DKK','EUR','GBP','HKD','HUF',
    'IDR','ILS','INR','ISK','JPY','KRW','MXN','MYR','NOK','NZD','PHP','PLN',
    'RON','SEK','SGD','THB','TRY','USD','ZAR'
  ];

  valutaDa = 'EUR';
  valutaA: string[] = [];
  amount = 1;

  risultato: any = null;

  amountStatica: number | null = null;
  valutaDaStatica: string | null = null;
  valutaAStatica: string[] | null = null;

  constructor(private conversionService: ConversionService) {
    console.log("Component creato");
  }

  ngOnInit() {
    console.log("ngOnInit eseguito");
  }

  // Aggiunge una nuova valuta alla lista
  aggiungiValuta() {
    // Trova la prima valuta non ancora selezionata E diversa da valutaDa
    const valutaDisponibile = this.valute.find(v => !this.valutaA.includes(v) && v !== this.valutaDa);
    
    if (valutaDisponibile) {
      this.valutaA.push(valutaDisponibile);
      console.log("Valuta aggiunta:", valutaDisponibile);
      console.log("Lista attuale:", this.valutaA);
    }
  }

  // Rimuove una valuta dalla lista
  rimuoviValuta(index: number) {
    this.valutaA.splice(index, 1);
    console.log("Valuta rimossa. Lista attuale:", this.valutaA);
  }

  // Rimuove la valuta "Da" dalle valute "A" se presente
  rimuoviValutaDaDaValuteA() {
    // Se cambio la valuta "Da" e questa è presente nelle valute "A", la rimuovo
    this.valutaA = this.valutaA.filter(v => v !== this.valutaDa);
    console.log("Valuta 'Da' cambiata. Valute 'A' aggiornate:", this.valutaA);
  }

  // Controlla che non ci siano duplicati (opzionale, per sicurezza)
  controllaValute() {
    console.log("Valute selezionate:", this.valutaA);
  }

  // Esegue la conversione
  converti(event: Event) {
    event.preventDefault();

    console.log("converti() chiamata");
    console.log("Valori usati:", {
      amount: this.amount,
      valutaDa: this.valutaDa,
      valutaA: this.valutaA
    });

    if (this.valutaA.length === 0) {
      console.log("Nessuna valuta selezionata");
      this.risultato = null;
      return;
    }

    // Carica i tassi e poi calcola
    this.conversionService.getConversion(this.valutaDa, this.valutaA)
      .subscribe(risposta => {
        const tassi = risposta.rates;
        console.log("Tassi ricevuti:", tassi);

        this.risultato = this.valutaA.map(val => ({
          valuta: val,
          valore: this.amount * tassi[val]
        }));

        console.log("Risultato finale:", this.risultato);

        this.amountStatica = this.amount;
        this.valutaDaStatica = this.valutaDa;
        this.valutaAStatica = [...this.valutaA];
      });
  }
}