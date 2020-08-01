import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Customer } from '../../interfaces/customer';
import { PaginationService } from 'src/app/services/pagination-service.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersListComponent implements OnInit {

  @ViewChild(IonInfiniteScroll, { static: false }) public ionInfiniteScrollElement: IonInfiniteScroll;

  @Input() loadedData: Customer[];
  @Input() loading: boolean;
  @Input() done: boolean;
  @Input() isSearching: boolean;
  @Input() searchResult: Customer[];
  @Input() maxHeightPercent : number = 60;
  @Input() isSelectable: boolean;

  @Output() onCustomerClicked: EventEmitter<Customer> = new EventEmitter<Customer>();

  subscriptions: Subscription[];
  lastIdSelected: string;

  constructor(private paginationService: PaginationService) {
    this.subscriptions = [];
  }

  ngOnInit() {
    this.subscriptions.push(
      this.paginationService.done.subscribe(done => {
        if (done === true && this.ionInfiniteScrollElement) {
          this.ionInfiniteScrollElement.disabled = true;
        }
      })
    );

    this.subscriptions.push(
      this.paginationService.loading.subscribe(async loading => {
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
    this.paginationService.reset();
  }

  selectCustomer(event) {
    if (event.id === this.lastIdSelected) {
      this.onCustomerClicked.emit(null);
      this.lastIdSelected = "";
    } else {
      this.onCustomerClicked.emit(event);
      this.lastIdSelected = event.id;
    }
  }

  loadData(event) {
    this.paginationService.more();
  }
}
