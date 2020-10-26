import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgendaHeaderComponent } from '../../../components/agenda-header/agenda-header.component';
import { AgendaTimeSelectorComponent } from '../../../components/agenda-time-selector/agenda-time-selector.component';
import { ComponentsModule } from '../../../components/components.module';
import { AgendaDetailsPageRoutingModule } from './agenda-details-routing.module';
import { AgendaDetailsPage } from './agenda-details.page';
import { AddAppointmentWizardComponent } from './add-appointment-wizard/add-appointment-wizard.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgendaDetailsPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [
    AgendaDetailsPage,
    AgendaTimeSelectorComponent,
    AgendaHeaderComponent,
  ],
})
export class AgendaDetailsPageModule {}
