import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Product } from '../../interfaces/product';
import { Subscription } from 'rxjs';
import { PaginationService } from '../../services/pagination-service.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent implements OnInit {

  @ViewChild(IonInfiniteScroll, { static: false }) public ionInfiniteScrollElement: IonInfiniteScroll;

  @Input() loadedData: Product[];
  @Input() loading: boolean;
  @Input() done: boolean;
  @Input() isSearching: boolean;
  @Input() searchResult: Product[];
  @Input() maxHeightPercent : number = 80   ;
  @Input() isSelectable: boolean;

  @Output() onCustomerClicked: EventEmitter<Product> = new EventEmitter<Product>();

  subscriptions: Subscription[];
  lastIdSelected: string;

  constructor(private productService: ProductsService) {
    this.subscriptions = [];    
  }

  ngOnInit() {
    this.subscriptions.push(
      this.productService.done.subscribe(done => {
        if (done === true && this.ionInfiniteScrollElement) {
          this.ionInfiniteScrollElement.disabled = true;
        }
      })
    );

    this.subscriptions.push(
      this.productService.loading.subscribe(async loading => {
        if (!loading && this.ionInfiniteScrollElement) {
          await this.ionInfiniteScrollElement.complete();
        }
      })
    );
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    // Reset para que si se cierra el modal y se vuelve a entrar la lista contenga solo los primeros 15 elementos.
    this.productService.reset();
  }

  selectProduct(event) {
    if (event.id === this.lastIdSelected) {
      this.onCustomerClicked.emit(null);
      this.lastIdSelected = "";
    } else {
      this.onCustomerClicked.emit(event);
      this.lastIdSelected = event.id;
    }
  }

  loadData(event) {
    this.productService.more();
  }

}
