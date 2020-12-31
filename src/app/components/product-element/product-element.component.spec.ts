import { IonicModule } from '@ionic/angular';
import { render, screen } from '@testing-library/angular';
import { duration } from 'moment';
import { Product } from '../../interfaces/product';
import { ProductElementComponent } from './product-element.component';

describe('Product Element Component', () => {
  function getProductFixture(): Product {
    return {
      description: 'pr 1',
      duration: duration(30, 'minutes'),
      id: '1',
      name: 'product',
    };
  }

  test('should show product info capitalized', async () => {
    await render(ProductElementComponent, {
      imports: [IonicModule],
      componentProperties: {
        product: getProductFixture(),
        isSelectable: false,
      },
    });

    expect(screen.getByText('Product'));
    expect(screen.getByText('Pr 1'));
    expect(screen.getByText("30'"));
  });

  test('should show radio-button when is selectable', async () => {
    await render(ProductElementComponent, {
      imports: [IonicModule],
      componentProperties: {
        product: getProductFixture(),
        isSelectable: true,
      },
    });

    expect(screen.getByTestId('radio-selector')).not.toBeNull();
  });
});
