import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundAnimComponent } from './background-anim.component';

describe('BackgroundAnimComponent', () => {
  let component: BackgroundAnimComponent;
  let fixture: ComponentFixture<BackgroundAnimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundAnimComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundAnimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
