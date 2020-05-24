import { Component, OnInit } from '@angular/core';
import { CustomersService } from '../services/customers.service';
import { Observable, of } from 'rxjs';
import { Customer } from '../interfaces/customer';
import { AuthService } from '../services/auth.service';
import { switchMap } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { AddCustomerPage } from './add-customer/add-customer.page';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  customers$: Observable<Customer[]>;

  constructor(
    private readonly customerService: CustomersService,
    private readonly auth: AuthService,
    private readonly modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.customers$ = this.auth.user$.pipe(
      switchMap(user => {
        return user ? this.customerService.getCustomers(user.id) : of(null);
      }),
    );
  }

  loadData(event) {}

  async addCustomer() {
    const modal = await this.modalCtrl.create({
      component: AddCustomerPage,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    console.log(data);
  }
}
