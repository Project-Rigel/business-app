import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddAgendaPageRoutingModule } from './add-agenda-routing.module';
import { AddAgendaFacade } from './add-agenda.facade';
import { AddAgendaState } from './add-agenda.state';
import { AddAgendaBasicInfoPage } from './containers/add-agenda-basic-info/add-agenda-basic-info.page';
import { AddAgendaConfigPage } from './containers/add-agenda-config/add-agenda-config.page';
import { AddAgendaPage } from './views/add-agenda/add-agenda.page';

@NgModule({
  entryComponents: [AddAgendaPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    AddAgendaPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AddAgendaPage, AddAgendaBasicInfoPage, AddAgendaConfigPage],
  providers: [AddAgendaState, AddAgendaFacade],
})
export class AddAgendaPageModule {}
