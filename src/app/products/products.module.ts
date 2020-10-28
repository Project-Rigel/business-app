import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ProductElementComponent } from "../components/product-element/product-element.component";
import { AddProductComponent } from "./add-product/add-product.component";
import { ProductsListComponent } from "./products-list/components/products-list.component";
import { ProductsPageRoutingModule } from "./products-routing.module";
import { ProductsPage } from "./products-list/containers/products.page";

@NgModule({
  entryComponents: [AddProductComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    ProductsPage,
    ProductsListComponent,
    ProductElementComponent,
    AddProductComponent,
  ],
  exports: [ProductsListComponent],
})
export class ProductsPageModule {}
