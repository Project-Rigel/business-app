import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomersPageRoutingModule } from './customers-routing.module';

import { CustomersPage } from './customers.page';
import { AddCustomerPage } from './add-customer/add-customer.page';

@NgModule({
  entryComponents:[AddCustomerPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomersPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CustomersPage, AddCustomerPage],

})
export class CustomersPageModule {}
