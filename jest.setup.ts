import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { configure } from '@testing-library/angular';
import '@testing-library/jest-dom';
import 'jest-preset-angular';
import 'zone.js/dist/zone'; // Included with Angular CLI.
import 'zone.js/dist/zone-testing';

configure({
  defaultImports: [IonicModule, ReactiveFormsModule],
});
