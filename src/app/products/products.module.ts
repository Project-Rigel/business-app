import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductElementComponent } from '../components/product-element/product-element.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductsListComponent } from './products-list/components/products-list.component';
import { ProductsListPage } from './products-list/containers/products-list-page.component';
import { ProductsPageRoutingModule } from './products-routing.module';
import { ProductsFacade } from './products.facade';
import { ProductsState } from './products.state';

@NgModule({
  entryComponents: [AddProductComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ProductsListPage,
    ProductsListComponent,
    ProductElementComponent,
    AddProductComponent,
  ],
  exports: [ProductsListComponent],
  providers: [ProductsFacade, ProductsState],
})
export class ProductsPageModule {}
