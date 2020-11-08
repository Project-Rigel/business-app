import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../interfaces/product';

@Injectable()
export class ProductsState {
  private updating$ = new BehaviorSubject<boolean>(false);
  private products$ = new BehaviorSubject<Product[]>([]);

  isUpdating$() {
    return this.updating$.asObservable();
  }

  setUpdating(isUpdating: boolean) {
    this.updating$.next(isUpdating);
  }

  setProducts(products: Product[]) {
    this.products$.next(products);
  }

  getProducts$() {
    return this.products$.asObservable();
  }
}
