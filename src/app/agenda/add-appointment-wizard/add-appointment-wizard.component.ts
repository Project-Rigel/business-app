import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonSlides, ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { Customer } from '../../interfaces/customer';
import { CustomersService } from '../../services/customers.service';
import { AuthService } from '../../services/auth.service';
import { PaginationService } from '../../services/pagination-service.service';
import { switchMap, take } from 'rxjs/operators';
import { ProductsService } from '../../services/products.service';
import { GetAvailableIntervalsService } from '../../services/get-available-intervals.service';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-add-appointment-wizard',
  templateUrl: './add-appointment-wizard.component.html',
  styleUrls: ['./add-appointment-wizard.component.scss'],
})
export class AddAppointmentWizardComponent implements OnInit, AfterViewInit {

  @ViewChild(IonSlides)
  ionSlides: IonSlides;
  search$: Observable<Customer[]>;
  searching = false;
  sliderOptions: any = {};
  agendaId: string;
  selectedCustomer: Customer;
  selectedProduct: Product;
  loading: boolean;

  lastIdSelected: string

  constructor(private readonly customerService: CustomersService,
              private readonly auth: AuthService,
              private readonly modalController: ModalController,
              public readonly paginationService: PaginationService,
              public readonly productsService: ProductsService,
              public readonly intervalsService: GetAvailableIntervalsService) {
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

  }

  async ngAfterViewInit(): Promise<void> {
    await this.ionSlides.lockSwipes(true);
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

  selectProduct(event) {
    if (event.id === this.lastIdSelected) {
      this.selectedProduct = null;
      this.lastIdSelected = "";
    } else {
      this.selectedProduct = event;
      this.lastIdSelected = event.id;
    }
  }

  closeModal() {
    this.loading = true;
    this.intervalsService.endpoint({
      businessId: 'hello', //not needed yet
      agendaId: this.agendaId,
      productId: this.selectedProduct.id,
      timestamp: new Date().toISOString(),
    }).pipe(take(1)).subscribe(async v => {
      this.loading = false;
      await this.modalController.dismiss({
        done: true,
        intervals: v.intervals,
        customer: this.selectedCustomer,
        product: this.selectedProduct,
      });
    }, error => {
      this.loading = false;
    });
  }

  async nextSlide() {
    await this.ionSlides.lockSwipeToNext(false);
    await this.ionSlides.slideNext(600);
    await this.ionSlides.lockSwipes(false);
    await this.ionSlides.lockSwipeToNext(true);
  }

  async cancel() {
    await this.modalController.dismiss({done: false})
  }
}
