import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { StepperModule } from 'primeng/stepper';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DropdownModule,
    ToastModule,
    SliderModule,
    DataViewModule,
    ButtonModule,
    PaginatorModule,
    CalendarModule,
    DialogModule,
    TableModule,
    StepperModule
  ],
  exports: [DropdownModule,ToastModule,SliderModule,DataViewModule, ButtonModule,PaginatorModule, CalendarModule, DialogModule,TableModule,StepperModule ]
})
export class PrimengLib { }
