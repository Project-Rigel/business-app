import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { scan, take, tap } from 'rxjs/operators';
import { Product } from '../interfaces/product';

interface QueryConfig {
  path: string; //  path to collection
  field: string; // field to orderBy
  limit: number; // limit per query
  reverse: boolean; // reverse order?
  prepend: boolean; // prepend to source?
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  // Source data
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);

  private query: QueryConfig;
  private businessId: string;

  // Observable data
  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();

  constructor(private afs: AngularFirestore) {}

  init(
    path: string,
    whereField: string,
    field: string,
    limit: number,
    opts?: any,
  ) {
    this.businessId = whereField;
    if (this.data) this.reset();
    this.query = {
      path,
      field,
      limit: limit,
      reverse: false,
      prepend: false,
      ...opts,
    };

    const first = this.afs.collection(this.query.path, ref => {
      return ref
        .where('businessId', '==', this.businessId)
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit);
    });

    this.mapAndUpdate(first);

    // Create the observable array for consumption in components
    this.data = this._data.asObservable().pipe(
      scan((acc, val) => {
        return this.query.prepend ? val.concat(acc) : acc.concat(val);
      }),
    );
  }

  public reset() {
    this._data.next([]);
    this._done.next(false);
    this._loading.next(false);
    this.data = of(null);

    const first = this.afs.collection(this.query.path, ref => {
      return ref
        .where('businessId', '==', this.businessId)
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit);
    });

    this.mapAndUpdate(first);

    // Create the observable array for consumption in components
    this.data = this._data.asObservable().pipe(
      scan((acc, val) => {
        return this.query.prepend ? val.concat(acc) : acc.concat(val);
      }),
    );
  }

  // Retrieves additional data from firestore
  more() {
    const cursor = this.getCursor();

    const more = this.afs.collection(this.query.path, ref => {
      return ref
        .where('businessId', '==', this.businessId)
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit)
        .startAfter(cursor);
    });
    this.mapAndUpdate(more);
  }

  // Determines the doc snapshot to paginate query
  private getCursor() {
    const current = this._data.value;
    if (current.length) {
      return this.query.prepend
        ? current[0].doc
        : current[current.length - 1].doc;
    }
    return null;
  }

  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: AngularFirestoreCollection<any>) {
    if (this._done.value || this._loading.value) {
      return;
    }

    // loading
    this._loading.next(true);

    // Map snapshot with doc ref (needed for cursor)
    return col
      .snapshotChanges()
      .pipe(
        tap(arr => {
          let values = arr.map(snap => {
            const data = snap.payload.doc.data();
            const doc = snap.payload.doc;
            return { ...data, doc };
          });

          // If prepending, reverse the batch order
          values = this.query.prepend ? values.reverse() : values;

          // update source with new values, done loading
          this._data.next(values);
          this._loading.next(false);

          // no more values, mark done
          if (!values.length) {
            this._done.next(true);
          }
        }),
        take(1),
      )
      .subscribe();
  }

  public async addProduct(
    businessId: string,
    name: string,
    description: string,
    duration: number,
  ) {
    const id = this.afs.createId();
    const data = {
      name,
      description,
      id,
      duration,
      businessId,
    };

    // await this.afs.collection(`products`).add(data);
    await this.afs
      .collection(`products`)
      .doc(id)
      .set(data);
  }

  public findProductByField(field: string, value: string) {
    return this.afs
      .collection<Product>(`products`, ref => {
        return ref
          .where('businessId', '==', this.businessId)
          .limit(15)
          .orderBy(field)
          .startAt(value.toLowerCase())
          .endAt(value.toLowerCase() + '\uf8ff');
      })
      .valueChanges();
  }
}
