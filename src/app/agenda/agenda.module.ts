import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgendaPageRoutingModule } from './agenda-routing.module';

import { AgendaPage } from './agenda.page';
import { HttpClientModule } from '@angular/common/http';
import { AddAgendaPage } from './add-agenda/add-agenda.page';
import { AddAgendaPageModule } from './add-agenda/add-agenda.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    AgendaPageRoutingModule,
    AddAgendaPageModule
  ],
  declarations: [AgendaPage],
})
export class AgendaPageModule {}
