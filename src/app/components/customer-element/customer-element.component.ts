import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Customer } from '../../interfaces/customer';

@Component({
  selector: 'app-customer-element',
  templateUrl: './customer-element.component.html',
  styleUrls: ['./customer-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerElementComponent implements OnInit {
  @Input() customer: Customer;
  @Input() isSelectable: boolean;

  constructor() {}

  ngOnInit() {}
}
