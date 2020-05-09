import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomersPage } from './customers.page';

const routes: Routes = [
  {
    path: '',
    component: CustomersPage
  },
  {
    path: 'customer-details',
    loadChildren: () => import('./customer-details/customer-details.module').then( m => m.CustomerDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersPageRoutingModule {}
