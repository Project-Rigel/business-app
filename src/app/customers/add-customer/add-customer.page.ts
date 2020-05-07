import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
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
      name: '',
      firstSurname: '',
      secondSurname: '',
      phone: '',
      email: '',
    });
  }

  async cancel() {
    await this.errorToastService.dismiss();
    await this.ctrl.dismiss({ done: false });
  }

  async submitForm(value: any, clientId: string) {
    console.log(this.customerForm.errors);
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
      await this.ctrl.dismiss({ done: true, values: this.customerForm.value });
    }
  }
}
