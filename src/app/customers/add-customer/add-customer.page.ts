import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { IonInput, ModalController } from '@ionic/angular';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { CustomersService } from '../../services/customers.service';
import { ErrorToastService } from '../../services/error-toast.service';
import { LoaderService } from '../../services/loader.service';
import { PhoneValidatorService } from '../../services/phone-validator.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.page.html',
  styleUrls: ['./add-customer.page.scss'],
})
export class AddCustomerPage implements OnInit {
  customerForm: FormGroup;
  submitEnabled = true;
  submitClicked = false;
  @ViewChild('inputNombre') input: IonInput;

  constructor(
    private ctrl: ModalController,
    private formBuilder: FormBuilder,
    private customersService: CustomersService,
    private errorToastService: ErrorToastService,
    public readonly auth: AuthService,
    private keyboard: Keyboard,
    public readonly alertService: AlertService,
    private loader: LoaderService,
  ) {}

  async ngOnInit() {
    // this.keyboard.show(); TODO this only shows in android. In Ios just need to focus the element
    this.submitEnabled = true;
    this.customerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      firstSurname: ['', [Validators.required]],
      secondSurname: ['', [Validators.required]],
      phone: [
        '',
        [Validators.required, PhoneValidatorService.validCountryPhone('ES')],
      ],
      email: ['', [Validators.email]],
    });
  }

  ionViewDidEnter() {
    console.log('entering');
    setTimeout(() => this.input.setFocus(), 100);
  }

  async cancel() {
    this.keyboard.hide();
    try {
      await this.errorToastService.dismiss();
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(async () => {
        await this.ctrl.dismiss({ done: false });
        this.submitClicked = false;
      }, 100);
    }

    //theres a bug in the animation of the keyboard which starts at the same time as the modal.
  }

  async submitForm(value: any, clientId: string) {
    this.submitClicked = true;
    if (!this.customerForm.valid) {
      await this.errorToastService.present({
        message: this.getErrorMessage(),
      });
    } else {
      await this.loader.showLoader();
      this.keyboard.hide();
      this.submitEnabled = false;
      try {
        await this.customersService.addCustomer(
          clientId,
          value.name.toString().toLowerCase(),
          value.firstSurname.toString().toLowerCase(),
          value.secondSurname.toString().toLowerCase(),
          value.email,
          value.phone,
        );
        await this.alertService.presentSimpleAlert(
          'Confirmación',
          'Cliente añadido con éxito. <br> ' +
            value.name.toString() +
            ' ' +
            value.firstSurname.toString(),
        );
      } finally {
        await this.loader.hideLoader();
      }

      await this.ctrl.dismiss({ done: true, values: this.customerForm.value });
      this.submitClicked = false;
    }
  }

  goToNext(event) {
    event.setFocus();
  }
  get email() {
    return this.customerForm.get('email');
  }

  get phone() {
    return this.customerForm.get('phone');
  }

  get firstSurname() {
    return this.customerForm.get('firstSurname');
  }

  get secondSurname() {
    return this.customerForm.get('secondSurname');
  }

  get name() {
    return this.customerForm.get('name');
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

  getErrorMessage(): string {
    let message: string;
    console.log(this.customerForm);

    if (this.email.invalid) {
      message = 'El email no tiene el formato correcto.';
    } else if (
      this.name.invalid ||
      this.firstSurname.invalid ||
      this.secondSurname.invalid
    ) {
      message = 'Rellene los campos obligatorios';
    } else {
      message = 'El número de telefono no es correcto';
    }
    return message;
  }
}
