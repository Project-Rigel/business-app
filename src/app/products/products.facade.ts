import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { UserState } from '../core/user/user.state';
import { Product } from '../interfaces/product';
import { User } from '../interfaces/user';
import { ProductsState } from './products.state';
import { ProductsAPIService } from './services/products-api.service';

@Injectable()
export class ProductsFacade {
  constructor(
    private apiService: ProductsAPIService,
    private state: ProductsState,
    private userState: UserState,
  ) {}

  loadProducts$(): Observable<Product[]> {
    return this.userState
      .getUser$()
      .pipe(
        switchMap((user: User) =>
          this.apiService
            .loadProducts$(user.businessId)
            .pipe(tap(products => this.state.setProducts(products))),
        ),
      );
  }
}
