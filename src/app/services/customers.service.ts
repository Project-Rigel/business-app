import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer } from '../interfaces/customer';
import { AuthService } from './auth.service';
import { PaginationService } from './pagination-service.service';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private businessId: string;

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthService,
    private paginationService: PaginationService,
  ) {
    this.auth.user$.subscribe(user => {
      this.businessId = user.businessId;
    });
  }

  public async addCustomer(
    clientId: string,
    name: string,
    firstSurname: string,
    secondSurname: string,
    email: string,
    phone: string,
  ) {
    const id = this.firestore.createId();

    const data: Customer = {
      id,
      name,
      email,
      firstSurname,
      secondSurname,
      phone,
      businessId: this.businessId,
    };
    await this.firestore
      .collection(`customers`)
      .doc(id)
      .set(data);

    this.paginationService.reset();
  }

  public findCustomerByNameTokens(
    userId: string,
    name: string,
    firstSurname?: string,
    secondSurname?: string,
  ) {
    const searchByName$ = this.findCustomersByField('name', name);
    const searchFirstSurnameAsName$ = this.findCustomersByField(
      'firstSurname',
      name,
    );
    const searchSecondSurnameAsName$ = this.findCustomersByField(
      'secondSurname',
      name,
    );

    let searchBySurname$: Observable<Customer[]>,
      searchBySecondSurname$: Observable<Customer[]>;

    if (firstSurname) {
      searchBySurname$ = this.findCustomersByField(
        'firstSurname',
        firstSurname,
      );
    }

    if (secondSurname) {
      searchBySecondSurname$ = this.findCustomersByField(
        'secondSurname',
        secondSurname,
      );
    }

    if (firstSurname && !secondSurname) {
      return merge(searchByName$, searchBySurname$).pipe(
        map(val => {
          return val.filter((v, i) => val.indexOf(v) === i);
        }),
      );
    }

    if (firstSurname && secondSurname) {
      return merge(
        searchByName$,
        searchBySurname$,
        searchBySecondSurname$,
      ).pipe(
        map(val => {
          return val.filter((v, i) => val.indexOf(v) === i);
        }),
      );
    }

    return combineLatest([
      searchByName$,
      searchFirstSurnameAsName$,
      searchSecondSurnameAsName$,
    ]).pipe(map(arr => arr.reduce((acc, cur) => acc.concat(cur))));
  }

  private findCustomersByField(field: string, value: string) {
    return this.firestore
      .collection<Customer>('customers', ref => {
        return ref
          .where('businessId', '==', this.businessId)
          .limit(10)
          .orderBy(field)
          .startAt(value)
          .endAt(value + '\uf8ff');
      })
      .valueChanges();
  }
}
