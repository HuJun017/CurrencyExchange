import { CommonModule } from '@angular/common';
import { StoricoService } from '../../services/storico-service/storico-service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-storico',
  imports: [CommonModule, FormsModule],
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
  risultato: any = null; // risultato finale


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
  this.storicoService.getConversion(this.valutaDa, this.DataAnno ?? '')
    .subscribe({
      next: risposta => this.tassi = risposta.rates,
      error: err => console.error("Errore tassi", err)
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