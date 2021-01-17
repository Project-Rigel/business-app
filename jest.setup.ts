import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { configure } from '@testing-library/angular';
import '@testing-library/jest-dom';
import 'jest-preset-angular';

configure({
  defaultImports: [IonicModule, ReactiveFormsModule],
});
