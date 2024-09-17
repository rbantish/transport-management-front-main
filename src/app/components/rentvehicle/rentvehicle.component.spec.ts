import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentvehicleComponent } from './rentvehicle.component';

describe('RentvehicleComponent', () => {
  let component: RentvehicleComponent;
  let fixture: ComponentFixture<RentvehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentvehicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentvehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
