import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
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

  constructor(private paginationService: PaginationService) {
    this.subscriptions = [];
    
    
   }

  ngOnInit() {
    console.log("LoadedData:");
    console.log(this.loadedData);

    this.subscriptions.push(
      this.paginationService.done.subscribe(done => {
        if (done === true && this.ionInfiniteScrollElement) {
          console.log("DONE");

          this.ionInfiniteScrollElement.disabled = true;
        }
      })
    );

    this.subscriptions.push(
      this.paginationService.loading.subscribe(async loading => {
        if (!loading && this.ionInfiniteScrollElement) {   
          console.log("LOADIBG");
                 
          await this.ionInfiniteScrollElement.complete();
        }
      })
    );
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
  }

  selectCustomer(event) {
    this.onCustomerClicked.emit(event);
    console.log("LoadedData:");
    console.log(this.loadedData);
    
    console.log("searchResult:");
    console.log(this.searchResult);
  }

  loadData(event) {
    console.log(this.ionInfiniteScrollElement);
    console.log("Loading more data");
    this.paginationService.more();
    //this.ionInfiniteScrollElement.disabled = true;
  }
}
