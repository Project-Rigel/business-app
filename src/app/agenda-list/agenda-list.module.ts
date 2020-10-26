import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgendaPageRoutingModule } from './agenda-list-routing.module';
import { AgendaListPage } from './views/agenda-list.page';
import { AgendaListState } from './agenda-list.state';
import { AgendaListFacade } from './agenda-list.facade';
import { AgendaListApiService } from './services/agenda-list-api.service';
import { AgendaListResolver } from './resolvers/agenda-list.resolver';
import { AddAppointmentWizardComponent } from './modules/agenda-details/add-appointment-wizard/add-appointment-wizard.component';
import { AgendaSettingsDataModalComponent } from '../components/agenda-settings-data-modal/agenda-settings-data-modal.component';
import { AppSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    AgendaPageRoutingModule,
    AppSharedModule
  ],
  declarations: [
    AgendaListPage,
    AddAppointmentWizardComponent,
    AgendaSettingsDataModalComponent,
  ],
  providers: [
    AgendaListState,
    AgendaListFacade,
    AgendaListApiService,
    AgendaListResolver
  ]
})
export class AgendaListModule {}
