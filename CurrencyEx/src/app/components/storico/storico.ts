import { CommonModule } from '@angular/common';
import { StoricoService } from '../../services/storico-service/storico-service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatepickerDirective } from '../../directives/datepicker.directive';

@Component({
  selector: 'app-storico',
  imports: [CommonModule, FormsModule, DatepickerDirective],
  templateUrl: './storico.html',
  styleUrl: './storico.css',
})
export class Storico {

  oggi: string = new Date().toISOString().split('T')[0];
  
  valute = [
    'AUD','BGN','BRL','CAD','CHF','CNY','CZK','DKK','EUR','GBP','HKD','HUF',
    'IDR','ILS','INR','ISK','JPY','KRW','MXN','MYR','NOK','NZD','PHP',
    'PLN','RON','SEK','SGD','THB','TRY','USD', 'ZAR'
  ];

  valutaDa = 'EUR';
  valutaA = 'USD';
  amount: number = 1;
  DataAnno: string = new Date().toISOString().split('T')[0];


  tassi: any = {};
  risultato: any = null;
  loading = false;


  //valute convertite
  //sono le variabili che vengono effetivamente visualizzati nel html, a fine di impedire l'aggiornamenteo dinamico
  amountStatica: number | null = null;
  valutaDaStatica: string | null = null;
  valutaAStatica: string | null = null;


  constructor(private storicoService: StoricoService) {}

  ngOnInit() {
    this.caricaTassi();
  }

  caricaTassi() {
    this.loading = true;
    this.storicoService.getConversion(this.valutaDa, this.DataAnno ?? '')
      .subscribe({
        next: risposta => { this.tassi = risposta.rates; this.loading = false; },
        error: err => { console.error("Errore tassi", err); this.loading = false; }
      });
  }

converti(event: Event) {
  event.preventDefault();

  const rate = this.tassi[this.valutaA];
  this.risultato = this.amount * rate;

  this.amountStatica = this.amount;
  this.valutaDaStatica = this.valutaDa;
  this.valutaAStatica = this.valutaA;
}
}