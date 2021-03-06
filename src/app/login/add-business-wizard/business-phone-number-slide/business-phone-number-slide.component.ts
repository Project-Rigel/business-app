import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { AlertService } from '../../../services/alert.service';
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
    private alertService: AlertService,
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
      await this.alertService.presentSimpleAlert(
        'Error',
        'Tiene que indicar un nº de teléfono válido',
      );
    } else {
      this.submitEnabled = false;
      this.submitClicked = false;
      if (this.phone.value.charAt(0) === '+') {
        this.onBusinessPhoneNumberChosen.emit(this.phone.value);
      } else {
        this.onBusinessPhoneNumberChosen.emit('+34' + this.phone.value);
      }
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
