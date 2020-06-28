import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Customer } from '../../interfaces/customer';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersListComponent implements OnInit {

  @Input() loadedData: Customer[];
  @Input() loading: boolean;
  @Input() done: boolean;
  @Input() isSearching: boolean;
  @Input() searchResult: Customer[];
  @Input() maxHeightPercent : number = 60;
  @Input() isSelectable: boolean;

  @Output() onCustomerClicked: EventEmitter<Customer> = new EventEmitter<Customer>();

  constructor() { }

  ngOnInit() {}

  selectCustomer(event) {
    this.onCustomerClicked.emit(event);
  }
}
