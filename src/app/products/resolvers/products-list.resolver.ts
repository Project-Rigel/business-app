import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Product } from '../../interfaces/product';
import { ProductsFacade } from '../products.facade';

@Injectable()
export class ProductsListResolver implements Resolve<Product[]> {
  constructor(private readonly facade: ProductsFacade) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<Product[]> | Promise<Product[]> | Product[] {
    return this.facade.loadProducts$().pipe(take(1));
  }
}
