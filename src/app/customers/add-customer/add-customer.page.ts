import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from '../../services/customers.service';
import { ErrorToastService } from '../../services/error-toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.page.html',
  styleUrls: ['./add-customer.page.scss'],
})
export class AddCustomerPage implements OnInit {
  customerForm: FormGroup;

  constructor(
    private ctrl: ModalController,
    private formBuilder: FormBuilder,
    private customersService: CustomersService,
    private errorToastService: ErrorToastService,
    public readonly auth: AuthService,
  ) {}

  ngOnInit() {
    this.customerForm = this.formBuilder.group({
      name: ['', [Validators.minLength(3)]],
      firstSurname: ['', [Validators.minLength(3)]],
      secondSurname: ['', [Validators.minLength(3)]],
      phone: ['', [Validators.maxLength(9), Validators.minLength(9)]],
      email: ['', [Validators.email]],
    });
  }

  async cancel() {
    await this.errorToastService.dismiss();
    await this.ctrl.dismiss({ done: false });
  }

  async submitForm(value: any, clientId: string) {
    if (!this.customerForm.valid) {
      await this.errorToastService.present({
        message: 'Rellene los campos obligatorios.',
      });
    } else {
      await this.customersService.addCustomer(
        clientId,
        value.name.toString().toLowerCase(),
        value.firstSurname.toString().toLowerCase(),
        value.secondSurname.toString().toLowerCase(),
        value.email,
        value.phone,
      );
    }
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
}
