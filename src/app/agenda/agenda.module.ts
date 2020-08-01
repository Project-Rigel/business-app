import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgendaPageRoutingModule } from './agenda-routing.module';

import { AgendaPage } from './agenda.page';
import { HttpClientModule } from '@angular/common/http';
import { AddAgendaPage } from './add-agenda/add-agenda.page';
import { AddAgendaPageModule } from './add-agenda/add-agenda.module';
import { AddAppointmentWizardComponent } from './add-appointment-wizard/add-appointment-wizard.component';
import { CustomersPageModule } from '../customers/customers.module';
import { ProductsPageModule } from '../products/products.module';
import { ProductsListComponent } from '../products/products-list/products-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    AgendaPageRoutingModule,
    AddAgendaPageModule,
    CustomersPageModule,
    ProductsPageModule
  ],
  declarations: [AgendaPage, AddAppointmentWizardComponent],
})
export class AgendaPageModule {}
