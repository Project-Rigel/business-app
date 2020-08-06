import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductsPage } from './products.page';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductElementComponent } from '../components/product-element/product-element.component';
import { AddProductComponent } from './add-product/add-product.component';

@NgModule({
  entryComponents: [AddProductComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ProductsPage, ProductsListComponent, ProductElementComponent, AddProductComponent],
  exports: [
    ProductsListComponent,
  ],
})
export class ProductsPageModule {}
