import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductsPage } from './products.page';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductElementComponent } from '../components/product-element/product-element.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule
  ],
  declarations: [ProductsPage, ProductsListComponent, ProductElementComponent],
  exports: [
    ProductsListComponent,
  ],
})
export class ProductsPageModule {}
