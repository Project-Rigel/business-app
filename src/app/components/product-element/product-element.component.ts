import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-product-element',
  templateUrl: './product-element.component.html',
  styleUrls: ['./product-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductElementComponent {
  @Input() product: Product;
  @Input() isSelectable: boolean;
}
