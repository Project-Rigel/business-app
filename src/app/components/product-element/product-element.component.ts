import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-product-element',
  templateUrl: './product-element.component.html',
  styleUrls: ['./product-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductElementComponent implements OnInit {

  @Input() product: Product;
  @Input() isSelectable: boolean;

  constructor() { }

  ngOnInit() {}

}
