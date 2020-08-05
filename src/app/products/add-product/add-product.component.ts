import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { IonInput, ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ErrorToastService } from '../../services/error-toast.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  submitEnabled: boolean = true;
  submitClicked = false;
  @ViewChild('productName') input: IonInput;

  constructor(
    private ctrl: ModalController,
    private formBuilder: FormBuilder,
    private productService: ProductsService,
    private errorToastService: ErrorToastService,
    public readonly auth: AuthService,
    private keyboard: Keyboard,
  ) {}

  async ngOnInit() {
    // this.keyboard.show(); TODO this only shows in android. In Ios just need to focus the element
    this.submitEnabled = true;
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      duration: ['', [Validators.required]],
    });
  }

  ionViewDidEnter() {
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

  async submitForm(value: any, businessId: string) {
    this.submitClicked = true;
    if (!this.productForm.valid) {
      await this.errorToastService.present({
        message: 'Error'
          ? 'El email no tiene el formato correcto.'
          : 'Rellene los campos obligatorios.',
      });
    } else {
      this.keyboard.hide();
      this.submitEnabled = false;
      await this.productService.addProduct(
        businessId,
        value.name.toString().toLowerCase(),
        value.description.toString().toLowerCase(),
        parseInt(value.duration),
      );

      await this.ctrl.dismiss({ done: true, values: this.productForm.value });
      this.submitClicked = false;
    }
  }

  goToNext(event) {
    event.setFocus();
  }

  get name() {
    return this.productForm.get('name');
  }
  get description() {
    return this.productForm.get('description');
  }
  get duration() {
    return this.productForm.get('duration');
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
