import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripbookingComponent } from './tripbooking.component';

describe('TripbookingComponent', () => {
  let component: TripbookingComponent;
  let fixture: ComponentFixture<TripbookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripbookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripbookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
