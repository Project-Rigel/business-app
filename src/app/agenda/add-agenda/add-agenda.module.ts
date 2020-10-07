import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddAgendaPageRoutingModule } from './add-agenda-routing.module';
import { AddAgendaPage } from './add-agenda.page';
import { AddAgendaBasicInfoPageModule } from "../add-agenda-basic-info/add-agenda-basic-info.module";
import { AddAgendaConfigPageModule } from "../add-agenda-config/add-agenda-config.module";

@NgModule({
  entryComponents: [AddAgendaPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    AddAgendaPageRoutingModule,
    ReactiveFormsModule,
    AddAgendaBasicInfoPageModule,
    AddAgendaConfigPageModule
  ],
  declarations: [AddAgendaPage],
})
export class AddAgendaPageModule {}
