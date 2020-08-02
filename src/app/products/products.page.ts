import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginationService } from '../services/pagination-service.service';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { Subscription, Observable } from 'rxjs';
import { Product } from '../interfaces/product';
import { take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ProductsService } from '../services/products.service';
import { AddProductComponent } from './add-product/add-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  subscriptions: Subscription[];
  search$: Observable<Product[]>;
  searchValue: string;
  searching = false;
  constructor(
    private readonly auth: AuthService,
    private readonly modalCtrl: ModalController,
    public productService: ProductsService
    ) {
    this.subscriptions = [];
   }

  ngOnInit() {
    this.auth.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.productService.init(
          'users/' + user.id + '/products',
          'name',
          15,
        );
      }
    });

  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
  }

  loadData(event) {
    // this.lastElement$.next(this.lastElement);
    this.productService.more();
  }

  async addProduct() {
    const modal = await this.modalCtrl.create({
      component: AddProductComponent,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    
    if (data.done) {
      this.productService.reset();
    }
  }

  async search(event) {
    let input = event.target.value.toString();

    if (input.length === 0) {
      this.searching = false;
    }
    if (input.length > 0) {
      this.searching = true;
      this.search$ = this.auth.user$.pipe(
        switchMap(user => {
          if (user) {
            return this.productService.findProductByField(
              user.id, // businessId
              'name',
              input
            );
          }
        }),
      );
    }
  }

  cancelSearch(event) {
    console.log('cancelling');
    this.searching = false;
    
  }
}
