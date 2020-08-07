import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AlertController, IonSlides, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Customer } from '../../interfaces/customer';
import { Product } from '../../interfaces/product';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { CustomersService } from '../../services/customers.service';
import { GetAvailableIntervalsService } from '../../services/get-available-intervals.service';
import { PaginationService } from '../../services/pagination-service.service';
import { ProductsService } from '../../services/products.service';

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
  daySelected: Date;
  selectedCustomer: Customer;
  selectedProduct: Product;
  loading: boolean;
  user: User;

  lastIdSelected: string;

  constructor(
    private readonly customerService: CustomersService,
    private readonly auth: AuthService,
    private readonly modalController: ModalController,
    public readonly paginationService: PaginationService,
    public readonly productsService: ProductsService,
    public readonly intervalsService: GetAvailableIntervalsService,
    public readonly alertController: AlertController,
    private chRef: ChangeDetectorRef,
  ) {
    // Para detectar los cambios de la variable loading en el html
  }

  ngOnInit() {
    this.auth.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.user = user;
        this.paginationService.init('customers', 'name', 15);

        this.productsService.init('products', user.businessId, 'name', 15);
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

  closeModal() {
    this.loading = true;
    this.intervalsService
      .endpoint({
        businessId: this.user.businessId, //not needed yet
        agendaId: this.agendaId,
        productId: 'U45erCOyCNz5TWw9SNjB',
        timestamp: this.daySelected.toISOString(),
      })
      .pipe(take(1))
      .subscribe(
        async (v: any) => {
          this.loading = false;
          await this.modalController.dismiss({
            done: true,
            intervals: v.intervals,
            customer: this.selectedCustomer,
            product: this.selectedProduct,
          });
        },
        err => {
          this.presentError().then(() => {
            this.loading = false;
            this.chRef.detectChanges();
            console.log(err);
          });
        },
      );
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

  // Mover a un componente a parte
  async presentError() {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      mode: 'ios',
      header: 'Error',
      subHeader: 'Servidor temporalmente no disponible. ',
      message: 'Inténtelo de nuevo más tarde.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
