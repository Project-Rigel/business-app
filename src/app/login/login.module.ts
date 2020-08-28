import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddBusinessWizardComponent } from './add-business-wizard/add-business-wizard.component';
import { BusinessAddressSlideComponent } from './add-business-wizard/business-address-slide/business-address-slide.component';
import { BusinessCifSlideComponent } from './add-business-wizard/business-cif-slide/business-cif-slide.component';
import { BusinessNameSlideComponent } from './add-business-wizard/business-name-slide/business-name-slide.component';
import { BusinessPhoneNumberSlideComponent } from './add-business-wizard/business-phone-number-slide/business-phone-number-slide.component';
import { BusinessPhoneValidationSlideComponent } from './add-business-wizard/business-phone-validation-slide/business-phone-validation-slide.component';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    LoginPageRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    LoginPage,
    AddBusinessWizardComponent,
    BusinessNameSlideComponent,
    BusinessCifSlideComponent,
    BusinessAddressSlideComponent,
    BusinessPhoneNumberSlideComponent,
    BusinessPhoneValidationSlideComponent,
  ],
})
export class LoginPageModule {}
