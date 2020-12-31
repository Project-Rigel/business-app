import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces/product';

@Injectable()
export class ProductsAPIService {
  constructor(private readonly repo: AngularFirestore) {}

  public loadProducts$(
    businessId: string,
    maxProducts = 20,
  ): Observable<Product[]> {
    return this.repo
      .collection<Product>('products', ref => {
        return ref
          .where('businessId', '==', businessId)
          .orderBy('name')
          .limit(maxProducts);
      })
      .valueChanges();
  }
}
