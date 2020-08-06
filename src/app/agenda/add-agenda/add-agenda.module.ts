import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddAgendaPageRoutingModule } from './add-agenda-routing.module';
import { AddAgendaPage } from './add-agenda.page';

@NgModule({
  entryComponents: [AddAgendaPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    AddAgendaPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AddAgendaPage],
})
export class AddAgendaPageModule {}
