import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor() {}

  getBusinessProducts(businessId: string): Observable<Product[]> {
    return of([
      {
        name: 'Primera Visita',
        id: '1',
        description: 'Primera visita para conocer al paciente.',
        duration: moment.duration(30, 'minutes'),
      },
      {
        name: 'Revisión tetas',
        id: '2',
        description: 'Revisión postoperatorio tetas',
        duration: moment.duration(60, 'minutes'),
      },
    ]);
  }
}
