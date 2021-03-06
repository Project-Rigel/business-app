import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PaginationService } from 'src/app/services/pagination-service.service';
import { Customer } from '../../interfaces/customer';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersListComponent implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false })
  public ionInfiniteScrollElement: IonInfiniteScroll;

  @Input() loadedData: Customer[];
  @Input() loading: boolean;
  @Input() done: boolean;
  @Input() isSearching: boolean;
  @Input() searchResult: Customer[];
  @Input() maxHeightPercent = 80;
  @Input() isSelectable: boolean;

  @Output() onCustomerClicked: EventEmitter<Customer> = new EventEmitter<
    Customer
  >();

  subscriptions: Subscription[];
  lastIdSelected: string;
  isLoadingCustomers = true;

  constructor(private paginationService: PaginationService) {
    this.subscriptions = [];
  }

  ngOnInit() {
    this.subscriptions.push(
      this.paginationService.done.subscribe(done => {
        if (done === true) {
          this.isLoadingCustomers = false;
          if (this.ionInfiniteScrollElement) {
            this.ionInfiniteScrollElement.disabled = true;
          }
        }
      }),
    );

    this.subscriptions.push(
      this.paginationService.loading.subscribe(async loading => {
        if (this.isLoadingCustomers === false) {
          this.isLoadingCustomers = loading;
        }
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
    // Reset para que si se cierra el modal y se vuelve a entrar la lista contenga solo los primeros 15 elementos.
    this.paginationService.reset();
  }

  selectCustomer(event) {
    if (event.id === this.lastIdSelected) {
      this.onCustomerClicked.emit(null);
      this.lastIdSelected = '';
    } else {
      this.onCustomerClicked.emit(event);
      this.lastIdSelected = event.id;
    }
  }

  loadData(event) {
    this.paginationService.more();
  }
}
