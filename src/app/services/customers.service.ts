import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { merge, Observable } from 'rxjs';
import { Customer } from '../interfaces/customer';
import * as firebase from 'firebase/app';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  constructor(private firestore: AngularFirestore) {}

  public getCustomers(
    clientId: string,
    orderByField: string,
    limit: number,
    lastCustomer?: Customer,
  ): Observable<Customer[]> {
    return this.firestore
      .collection<Customer>(`users/${clientId}/customers`, ref => {
        let query:
          | firebase.firestore.CollectionReference
          | firebase.firestore.Query = ref;
        query = query.orderBy(orderByField);
        query = query.limit(limit);

        if (lastCustomer && lastCustomer[orderByField]) {
          console.log(lastCustomer[orderByField]);

          query = query.startAfter(lastCustomer[orderByField]);
        }

        return query;
      })
      .valueChanges();
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
    };

    await this.firestore.collection(`users/${clientId}/customers`).add(data);
  }

  public findCustomerByNameTokens(
    userId: string,
    name: string,
    firstSurname?: string,
    secondSurname?: string,
  ) {
    let searchByName$: Observable<Customer[]> = this.findCustomersByField(
      userId,
      'name',
      name,
    );

    let searchBySurname$: Observable<Customer[]>,
      searchBySecondSurname$: Observable<Customer[]>;

    if (firstSurname) {
      searchBySurname$ = this.findCustomersByField(
        userId,
        'firstSurname',
        firstSurname,
      );
    }

    if (secondSurname) {
      searchBySecondSurname$ = this.findCustomersByField(
        userId,
        'secondSurname',
        secondSurname,
      );
    }

    if(firstSurname){
      return merge(searchByName$, searchBySurname$).pipe(map(val => {
        return val.filter((v, i) => val.indexOf(v) === i);
      }));
    }

    if(secondSurname){
      return merge(searchByName$, searchBySurname$, searchBySecondSurname$).pipe(map(val => {
        return val.filter((v, i) => val.indexOf(v) === i);
      }));
    }

    return searchByName$;

  }

  private findCustomersByField(userId: string, field: string, value: string) {
    return this.firestore
      .collection<Customer>('users/' + userId + '/customers', ref => {
        return ref
          .limit(10)
          .orderBy(field)
          .startAt(value)
          .endAt(value + '\uf8ff');
      })
      .valueChanges();
  }
}
