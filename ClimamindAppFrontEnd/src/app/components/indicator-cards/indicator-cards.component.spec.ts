import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorCardsComponent } from './indicator-cards.component';

describe('IndicatorCardsComponent', () => {
  let component: IndicatorCardsComponent;
  let fixture: ComponentFixture<IndicatorCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatorCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicatorCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
