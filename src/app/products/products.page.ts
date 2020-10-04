import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Product } from '../interfaces/product';
import { AuthService } from '../services/auth.service';
import { ProductsService } from '../services/products.service';
import { AddProductComponent } from './add-product/add-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  search$: Observable<Product[]>;
  searchValue: string;
  searching = false;
  constructor(
    private readonly auth: AuthService,
    private readonly modalCtrl: ModalController,
    public productService: ProductsService,
  ) {}

  ngOnInit() {
    this.auth.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.productService.init('products', user.businessId, 'name', 15);
      }
    });
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
    const input = event.target.value.toString();

    if (input.length === 0) {
      this.searching = false;
    }
    if (input.length > 0) {
      this.searching = true;
      this.search$ = this.auth.user$.pipe(
        switchMap(user => {
          if (user) {
            return this.productService.findProductByField('name', input);
          }
        }),
      );
    }
  }

  cancelSearch() {
    this.searching = false;
  }
}
