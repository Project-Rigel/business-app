import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAgendaConfigPageRoutingModule } from './add-agenda-config-routing.module';

import { AddAgendaConfigPage } from './add-agenda-config.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddAgendaConfigPageRoutingModule
  ],
  exports: [
    AddAgendaConfigPage
  ],
  declarations: [AddAgendaConfigPage]
})
export class AddAgendaConfigPageModule {}
