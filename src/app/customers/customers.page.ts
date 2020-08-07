import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Customer } from '../interfaces/customer';
import { AuthService } from '../services/auth.service';
import { CustomersService } from '../services/customers.service';
import { PaginationService } from '../services/pagination-service.service';
import { AddCustomerPage } from './add-customer/add-customer.page';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  subscriptions: Subscription[];
  search$: Observable<Customer[]>;
  searchValue: string;
  searching = false;

  constructor(
    private readonly customerService: CustomersService,
    private readonly auth: AuthService,
    private readonly modalCtrl: ModalController,
    public readonly paginationService: PaginationService,
  ) {}

  ngOnInit() {
    this.auth.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.paginationService.init(
          'users/' + user.id + '/customers',
          'name',
          15,
        );
      }
    });
  }

  async addCustomer() {
    const modal = await this.modalCtrl.create({
      component: AddCustomerPage,
    });
    await modal.present();
    await modal.onDidDismiss();
  }

  async search(event) {
    let inputs = event.target.value.toString().split(' ');

    inputs = inputs.filter(val => val !== '' && val !== ' ');

    if (inputs.length === 0) {
      this.searching = false;
    }
    if (inputs.length > 0) {
      this.searching = true;
      this.search$ = this.auth.user$.pipe(
        switchMap(user => {
          if (user) {
            return this.customerService.findCustomerByNameTokens(
              user.id,
              inputs[0].toLowerCase(),
              inputs[1] ? inputs[1].toLowerCase() : undefined,
              inputs[2] ? inputs[2].toLowerCase() : undefined,
            );
          }
        }),
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cancelSearch($event) {
    console.log('cancelling');
    this.searching = false;
  }
}
