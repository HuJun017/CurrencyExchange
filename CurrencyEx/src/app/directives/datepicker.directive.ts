import { Directive, ElementRef, AfterViewInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import flatpickr from 'flatpickr';
import { Italian } from 'flatpickr/dist/l10n/it.js';
import { Instance } from 'flatpickr/dist/types/instance';

@Directive({
  selector: 'input[appDatepicker]',
  standalone: true,
})
export class DatepickerDirective implements AfterViewInit, OnDestroy, OnChanges {

  @Input() appDatepickerMin?: string;
  @Input() appDatepickerMax?: string;

  private fp!: Instance;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  ngAfterViewInit() {
    this.fp = flatpickr(this.el.nativeElement, {
      dateFormat: 'Y-m-d',
      locale: Italian,
      allowInput: true,
      disableMobile: true,
      monthSelectorType: 'static',
      appendTo: document.body,
      minDate: this.appDatepickerMin ?? (this.el.nativeElement.min || undefined),
      maxDate: this.appDatepickerMax ?? (this.el.nativeElement.max || undefined),
      onChange: (_dates, dateStr) => {
        // Aggiorna il valore nativo e notifica Angular (ngModel + event binding)
        this.el.nativeElement.value = dateStr;
        this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
        this.el.nativeElement.dispatchEvent(new Event('change', { bubbles: true }));
      },
    }) as Instance;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.fp) return;
    if (changes['appDatepickerMin']) this.fp.set('minDate', this.appDatepickerMin);
    if (changes['appDatepickerMax']) this.fp.set('maxDate', this.appDatepickerMax);
  }

  ngOnDestroy() {
    this.fp?.destroy();
  }
}
