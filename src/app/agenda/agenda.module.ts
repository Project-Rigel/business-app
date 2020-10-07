import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgendaSettingsDataModalComponent } from '../components/agenda-settings-data-modal/agenda-settings-data-modal.component';
import { CustomersPageModule } from '../customers/customers.module';
import { ProductsPageModule } from '../products/products.module';
import { AddAgendaPageModule } from './add-agenda/add-agenda.module';
import { AddAppointmentWizardComponent } from './add-appointment-wizard/add-appointment-wizard.component';
import { AgendaPageRoutingModule } from './agenda-routing.module';
import { AgendaPage } from './agenda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    AgendaPageRoutingModule,
    AddAgendaPageModule,
    CustomersPageModule,
    ProductsPageModule,
  ],
  declarations: [
    AgendaPage,
    AddAppointmentWizardComponent,
    AgendaSettingsDataModalComponent,
  ],
})
export class AgendaPageModule {}
