import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { IonSlides, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Customer } from '../../interfaces/customer';
import { Product } from '../../interfaces/product';
import { User } from '../../interfaces/user';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { CustomersService } from '../../services/customers.service';
import { LoaderService } from '../../services/loader.service';
import { PaginationService } from '../../services/pagination-service.service';

@Component({
  selector: 'app-add-appointment-wizard',
  templateUrl: './add-appointment-wizard.component.html',
  styleUrls: ['./add-appointment-wizard.component.scss'],
})
export class AddAppointmentWizardComponent implements OnInit, AfterViewInit {
  @ViewChild(IonSlides)
  ionSlides: IonSlides;
  search$: Observable<Customer[]>;
  searchProduct$: Observable<Product[]>;
  searching = false;
  sliderOptions: any = {};
  agendaId: string;
  daySelected: Date;
  selectedCustomer: Customer;
  selectedProduct: Product;
  user: User;

  searcherStyle = 17;
  listStyle = 68;
  buttonStyle = 15;

  constructor(
    private readonly customerService: CustomersService,
    private readonly auth: AuthService,
    private readonly modalController: ModalController,
    public readonly paginationService: PaginationService,
    public readonly alertService: AlertService,
    private chRef: ChangeDetectorRef,
    private loader: LoaderService,
    private keyboard: Keyboard,
  ) {
    // Para detectar los cambios de la variable loading en el html
    this.keyboard.onKeyboardDidShow().subscribe(() => {
      this.searcherStyle = 25;
      this.listStyle = 75;
      this.buttonStyle = 0;
    });

    this.keyboard.onKeyboardDidHide().subscribe(() => {
      this.searcherStyle = 17;
      this.listStyle = 68;
      this.buttonStyle = 15;
    });
  }

  ngOnInit() {
    this.auth.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.user = user;
        this.paginationService.init('customers', 'name', 15);

        //this.productsService.init('products', user.businessId, 'name', 15);
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

  async searchProduct(event) {
    const input = event.target.value.toString();

    if (input.length === 0) {
      this.searching = false;
    }
    if (input.length > 0) {
      this.searching = true;
      /* this.searchProduct$ = this.auth.user$.pipe(
        switchMap(user => {
          if (user) {
            return this.productsService.findProductByField('name', input);
          }
        }),
      );*/
    }
  }

  async closeModal() {
    await this.modalController.dismiss({
      done: true,
      customer: this.selectedCustomer,
      product: this.selectedProduct,
    });
  }

  async nextSlide() {
    await this.ionSlides.lockSwipeToNext(false);
    await this.ionSlides.slideNext(600);
    await this.ionSlides.lockSwipes(false);
    await this.ionSlides.lockSwipeToNext(true);
  }

  async cancel() {
    await this.modalController.dismiss({ done: false });
  }
}
