import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-business-address-slide',
  templateUrl: './business-address-slide.component.html',
  styleUrls: ['./business-address-slide.component.scss'],
})
export class BusinessAddressSlideComponent implements OnInit {
  @Output() onBusinessAddressChosen = new EventEmitter<any>();

  businessAddressForm: FormGroup;
  submitEnabled = true;
  submitClicked = false;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.businessAddressForm = this.formBuilder.group({
      address: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      province: ['', [Validators.required]],
      ca: ['', [Validators.required]],
    });
  }

  async submitForm(value: any) {
    this.submitClicked = true;
    if (!this.businessAddressForm.valid) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, rellene todos lso campos',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      this.submitEnabled = false;
      this.submitClicked = false;
      this.onBusinessAddressChosen.emit({
        address: this.address.value,
        postalCode: this.postalCode.value,
        province: this.province.value,
        ca: this.ca.value,
      });
    }
  }

  get address() {
    return this.businessAddressForm.get('address');
  }

  get postalCode() {
    return this.businessAddressForm.get('postalCode');
  }

  get province() {
    return this.businessAddressForm.get('province');
  }

  get ca() {
    return this.businessAddressForm.get('ca');
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
