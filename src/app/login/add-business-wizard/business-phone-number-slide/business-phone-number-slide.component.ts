import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertController, IonInput } from '@ionic/angular';
import { PhoneValidatorService } from '../../../services/phone-validator.service';

@Component({
  selector: 'app-business-phone-number-slide',
  templateUrl: './business-phone-number-slide.component.html',
  styleUrls: ['./business-phone-number-slide.component.scss'],
})
export class BusinessPhoneNumberSlideComponent {
  @Output() onBusinessPhoneNumberChosen = new EventEmitter<string>();
  @ViewChild('businessPhone') input: IonInput;
  businessPhoneForm: FormGroup;
  submitEnabled = true;
  submitClicked = false;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.businessPhoneForm = this.formBuilder.group({
      phone: [
        '',
        [Validators.required, PhoneValidatorService.validCountryPhone('ES')],
      ],
    });
  }

  async submitForm(value: any) {
    this.submitClicked = true;
    if (!this.businessPhoneForm.valid) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Tiene que indicar un nº de teléfono válido',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      this.submitEnabled = false;
      this.submitClicked = false;
      this.onBusinessPhoneNumberChosen.emit('+34' + this.phone.value);
    }
  }

  get phone() {
    return this.businessPhoneForm.get('phone');
  }

  isInputInvalid(control: AbstractControl) {
    if (this.submitClicked && control.invalid) {
      return true;
    }
    if (control.invalid && control.touched && this.submitClicked) {
      return true;
    }

    if (control.invalid && control.touched && !this.submitClicked) {
      return false;
    }

    return false;
  }
}
