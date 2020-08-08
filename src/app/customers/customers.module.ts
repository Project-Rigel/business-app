import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomerElementComponent } from '../components/customer-element/customer-element.component';
import { AddCustomerPage } from './add-customer/add-customer.page';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomersPageRoutingModule } from './customers-routing.module';
import { CustomersPage } from './customers.page';

@NgModule({
  entryComponents: [AddCustomerPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomersPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [
    CustomersPage,
    AddCustomerPage,
    CustomerElementComponent,
    CustomersListComponent,
  ],

  exports: [CustomersListComponent],
})
export class CustomersPageModule {}
