import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMessageService } from '../services/custom-message.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [CommonModule,FormsModule,ReactiveFormsModule],
  providers: [CustomMessageService]
})
export class CoreModule { }
