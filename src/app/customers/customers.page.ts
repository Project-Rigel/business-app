import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CustomersService } from '../services/customers.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Customer } from '../interfaces/customer';
import { AuthService } from '../services/auth.service';
import { switchMap, take } from 'rxjs/operators';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { AddCustomerPage } from './add-customer/add-customer.page';
import { PaginationService } from '../services/pagination-service.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll, { static: false })
  ionInfiniteScrollElement: IonInfiniteScroll;

  subscriptions: Subscription[];
  search$: Observable<Customer[]>;
  searchValue: string;
  searching = false;

  constructor(
    private readonly customerService: CustomersService,
    private readonly auth: AuthService,
    private readonly modalCtrl: ModalController,
    public readonly paginationService: PaginationService,
  ) {
    this.subscriptions = [];
  }

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

    this.subscriptions.push(
      this.paginationService.done.subscribe(done => {
        if (done === true) {
          this.ionInfiniteScrollElement.disabled = true;
        }
      }),
    );

    this.subscriptions.push(
      this.paginationService.loading.subscribe(async loading => {
        if (!loading && this.ionInfiniteScrollElement) {
          await this.ionInfiniteScrollElement.complete();
        }
      }),
    );
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
  }

  loadData(event) {
    // this.lastElement$.next(this.lastElement);
    this.paginationService.more();
  }

  async addCustomer() {
    const modal = await this.modalCtrl.create({
      component: AddCustomerPage,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (this.ionInfiniteScrollElement) {
      this.ionInfiniteScrollElement.disabled = false;
    }
    this.paginationService.reset();
  }

  async search(event) {
    let inputs = event.target.value.toString().split(' ');

    inputs = inputs.filter(val => val !== '' && val !== ' ');

    if (inputs[0]) {
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

  cancelSearch(event) {
    console.log('cancelling');
    this.searching = false;
    if (this.ionInfiniteScrollElement) {
      this.ionInfiniteScrollElement.disabled = false;
    }
  }
}
