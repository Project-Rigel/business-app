import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from '@ionic/angular';

import { AddAgendaBasicInfoPageRoutingModule } from './add-agenda-basic-info-routing.module';

import { AddAgendaBasicInfoPage } from './add-agenda-basic-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddAgendaBasicInfoPageRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
    AddAgendaBasicInfoPage
  ],
  declarations: [AddAgendaBasicInfoPage]
})
export class AddAgendaBasicInfoPageModule {}
