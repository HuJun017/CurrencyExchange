import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Storico } from './storico';

describe('Storico', () => {
  let component: Storico;
  let fixture: ComponentFixture<Storico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Storico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Storico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
