import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Business } from '../interfaces/business';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  private businessId: string;

  constructor(private firebase: AngularFirestore) {}

  public async addBusiness(business: Business) {
    business.id = this.businessId;
    await this.firebase
      .collection(`business`)
      .doc(this.businessId)
      .set(business);
  }

  setBusinessId(id: string) {
    this.businessId = id;
  }
}
