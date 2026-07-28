import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastWaveComponent } from './forecast-wave.component';

describe('ForecastWaveComponent', () => {
  let component: ForecastWaveComponent;
  let fixture: ComponentFixture<ForecastWaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForecastWaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForecastWaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
