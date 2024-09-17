import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentaltripTableComponent } from './rental-table.component';

describe('RentaltripTableComponent', () => {
  let component: RentaltripTableComponent;
  let fixture: ComponentFixture<RentaltripTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentaltripTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentaltripTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
