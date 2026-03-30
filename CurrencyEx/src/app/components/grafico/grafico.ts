import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GraficoService } from '../../services/grafico-service/grafico-service';
import { DatepickerDirective } from '../../directives/datepicker.directive';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-grafico',
  standalone: true,
  imports: [CommonModule, FormsModule, DatepickerDirective],
  templateUrl: './grafico.html',
  styleUrl: './grafico.css'
})
export class Grafico implements OnDestroy {

  valute = [
    'AUD','BGN','BRL','CAD','CHF','CNY','CZK','DKK','EUR','GBP','HKD','HUF',
    'IDR','ILS','INR','ISK','JPY','KRW','MXN','MYR','NOK','NZD','PHP','PLN',
    'RON','SEK','SGD','THB','TRY','USD','ZAR'
  ];

  valutaDa = 'EUR';
  valutaA  = 'USD';
  periodo  = '3M';
  dataInizio = '';
  dataFine   = '';
  oggi = new Date().toISOString().split('T')[0];

  loading = false;
  errore  = false;
  cercatoValutaDa: string | null = null;
  cercatoValutaA:  string | null = null;

  minRate:    number | null = null;
  maxRate:    number | null = null;
  avgRate:    number | null = null;
  firstRate:  number | null = null;
  lastRate:   number | null = null;
  variazione: number | null = null;

  periodi = [
    { label: '1 Mese',        value: '1M'     },
    { label: '3 Mesi',        value: '3M'     },
    { label: '6 Mesi',        value: '6M'     },
    { label: '1 Anno',        value: '1Y'     },
    { label: 'Personalizzato', value: 'custom' },
  ];

  private chart: Chart | null = null;

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private graficoService: GraficoService) {
    this.aggiornaPeriodo();
  }

  aggiornaPeriodo() {
    const fine   = new Date();
    const inizio = new Date();
    switch (this.periodo) {
      case '1M': inizio.setMonth(inizio.getMonth() - 1);         break;
      case '3M': inizio.setMonth(inizio.getMonth() - 3);         break;
      case '6M': inizio.setMonth(inizio.getMonth() - 6);         break;
      case '1Y': inizio.setFullYear(inizio.getFullYear() - 1);   break;
    }
    this.dataFine   = fine.toISOString().split('T')[0];
    this.dataInizio = inizio.toISOString().split('T')[0];
  }

  onPeriodoChange() {
    if (this.periodo !== 'custom') this.aggiornaPeriodo();
  }

  cerca(event: Event) {
    event.preventDefault();
    this.loading = true;
    this.errore  = false;

    this.graficoService.getSerie(this.valutaDa, this.valutaA, this.dataInizio, this.dataFine)
      .subscribe({
        next: (data) => {
          this.loading = false;
          const labels = Object.keys(data.rates);
          const values: number[] = labels.map(d => data.rates[d][this.valutaA]);

          this.firstRate  = values[0];
          this.lastRate   = values[values.length - 1];
          this.minRate    = Math.min(...values);
          this.maxRate    = Math.max(...values);
          this.avgRate    = values.reduce((a, b) => a + b, 0) / values.length;
          this.variazione = ((this.lastRate - this.firstRate) / this.firstRate) * 100;

          this.cercatoValutaDa = this.valutaDa;
          this.cercatoValutaA  = this.valutaA;

          setTimeout(() => this.renderChart(labels, values), 0);
        },
        error: () => { this.loading = false; this.errore = true; }
      });
  }

  renderChart(labels: string[], values: number[]) {
    this.chart?.destroy();

    const positivo = this.variazione !== null && this.variazione >= 0;
    const colore      = positivo ? '#10b981' : '#ef4444';
    const coloreFill  = positivo ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)';

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${this.cercatoValutaDa} → ${this.cercatoValutaA}`,
          data: values,
          borderColor: colore,
          backgroundColor: coloreFill,
          borderWidth: 2.5,
          pointRadius: labels.length > 90 ? 0 : 3,
          pointHoverRadius: 6,
          pointBackgroundColor: colore,
          fill: true,
          tension: 0.35,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.9)',
            titleFont: { size: 12 },
            bodyFont:  { size: 13 },
            padding: 10,
            callbacks: {
              label: ctx => ` ${(ctx.parsed.y ?? 0).toFixed(4)} ${this.cercatoValutaA}`
            }
          }
        },
        scales: {
          x: {
            ticks: { maxTicksLimit: 8, font: { size: 11 }, color: '#64748b' },
            grid:  { color: 'rgba(0,0,0,0.04)' }
          },
          y: {
            ticks: {
              font: { size: 11 },
              color: '#64748b',
              callback: v => Number(v).toFixed(4)
            },
            grid: { color: 'rgba(0,0,0,0.04)' }
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }
}
