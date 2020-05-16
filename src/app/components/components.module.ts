import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [DatePickerComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [DatePickerComponent]
})
export class ComponentsModule { }
