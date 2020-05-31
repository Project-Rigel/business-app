import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  constructor() {
  }

  getBusinessProducts(businessId: string): Observable<Product[]> {
    return of([{ name: 'product 1', id: '1', description: 'THe first product in the world.' }, {
      name: 'product 2',
      id: '2',
      description: 'Lorem ipsum lorem ipsum',
    }]);
  }
}
