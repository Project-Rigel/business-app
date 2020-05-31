import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomersPageRoutingModule } from './customers-routing.module';

import { CustomersPage } from './customers.page';
import { AddCustomerPage } from './add-customer/add-customer.page';
import { CustomerElementComponent } from '../components/customer-element/customer-element.component';
import { CustomersListComponent } from './customers-list/customers-list.component';

@NgModule({
  entryComponents: [AddCustomerPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomersPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [CustomersPage, AddCustomerPage, CustomerElementComponent, CustomersListComponent],

  exports: [
    CustomersListComponent,
  ],
})
export class CustomersPageModule {}
