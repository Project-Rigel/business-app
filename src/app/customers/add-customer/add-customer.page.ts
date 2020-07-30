import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CustomersService } from '../../services/customers.service';
import { ErrorToastService } from '../../services/error-toast.service';
import { AuthService } from '../../services/auth.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.page.html',
  styleUrls: ['./add-customer.page.scss'],
})
export class AddCustomerPage implements OnInit {
  customerForm: FormGroup;
  submitEnabled: boolean = true;
  submitClicked = false;
  @ViewChild('inputNombre') input: IonInput;

  constructor(
    private ctrl: ModalController,
    private formBuilder: FormBuilder,
    private customersService: CustomersService,
    private errorToastService: ErrorToastService,
    public readonly auth: AuthService,
    private keyboard: Keyboard,
  ) {}

  async ngOnInit() {
    // this.keyboard.show(); TODO this only shows in android. In Ios just need to focus the element
    this.submitEnabled = true;
    this.customerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      firstSurname: ['', [Validators.required]],
      secondSurname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
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
        message: this.email.invalid
          ? 'El email no tiene el formato correcto.'
          : 'Rellene los campos obligatorios.',
      });
    } else {
      this.keyboard.hide();
      this.submitEnabled = false;
      await this.customersService.addCustomer(
        clientId,
        value.name.toString().toLowerCase(),
        value.firstSurname.toString().toLowerCase(),
        value.secondSurname.toString().toLowerCase(),
        value.email,
        value.phone,
      );

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
}
