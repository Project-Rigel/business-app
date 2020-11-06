import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductElementComponent } from '../components/product-element/product-element.component';
import { AddProductContainerComponent } from './add-product/containers/add-product-container.component';
import { ProductsListComponent } from './products-list/components/products-list.component';
import { ProductsListPage } from './products-list/containers/products-list-page.component';
import { ProductsPageRoutingModule } from './products-routing.module';
import { ProductsFacade } from './products.facade';
import { ProductsState } from './products.state';
import { ProductsListResolver } from './resolvers/products-list.resolver';
import { AddProductFormComponent } from './add-product/components/add-product-form/add-product-form.component';

@NgModule({
  entryComponents: [AddProductContainerComponent],
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
    AddProductContainerComponent,
    AddProductFormComponent,
  ],
  exports: [ProductsListComponent],
  providers: [ProductsFacade, ProductsState, ProductsListResolver],
})
export class ProductsPageModule {}
