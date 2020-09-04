import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertController, IonInput } from '@ionic/angular';

@Component({
  selector: 'app-business-phone-validation-slide',
  templateUrl: './business-phone-validation-slide.component.html',
  styleUrls: ['./business-phone-validation-slide.component.scss'],
})
export class BusinessPhoneValidationSlideComponent {
  @Output() onBusinessCodeSet = new EventEmitter<string>();
  @ViewChild('businessValidationCode') input: IonInput;
  businessCodeForm: FormGroup;
  submitEnabled = true;
  submitClicked = false;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.businessCodeForm = this.formBuilder.group({
      code: ['', [Validators.required]],
    });
  }

  async submitForm(value: any) {
    this.submitClicked = true;
    if (!this.businessCodeForm.valid) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Tiene que escribir el código recibido por sms',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      this.submitEnabled = false;
      this.submitClicked = false;
      this.onBusinessCodeSet.emit(this.code.value);
    }
  }

  get code() {
    return this.businessCodeForm.get('code');
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
