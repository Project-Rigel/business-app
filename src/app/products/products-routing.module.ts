import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsListPage } from './products-list/containers/products-list-page.component';
import { ProductsListResolver } from './resolvers/products-list.resolver';

const routes: Routes = [
  {
    path: '',
    component: ProductsListPage,
    resolve: {
      products: ProductsListResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsPageRoutingModule {}
