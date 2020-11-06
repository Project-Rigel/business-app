import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { IonInput, ModalController } from '@ionic/angular';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { ErrorToastService } from '../../../services/error-toast.service';
import { LoaderService } from '../../../services/loader.service';
import { ProductsService } from '../../../services/products.service';
import { ProductsFacade } from '../../products.facade';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product-container.component.html',
  styleUrls: ['./add-product-container.component.scss'],
})
export class AddProductContainerComponent implements OnInit {
  productForm: FormGroup;
  submitEnabled = true;
  submitClicked = false;
  @ViewChild('productName') input: IonInput;

  constructor(
    private ctrl: ModalController,
    private formBuilder: FormBuilder,
    private errorToastService: ErrorToastService,
    private keyboard: Keyboard,
    private loader: LoaderService,
    private alertService: AlertService,
    private productFacade: ProductsFacade
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

      this.productForm.err
      await this.errorToastService.present({
        message: 'Error'
          ? 'El email no tiene el formato correcto.'
          : 'Rellene los campos obligatorios.',
      });
    } else {
      await this.loader.showLoader();
      this.keyboard.hide();
      this.submitEnabled = false;
      try {
        this.productFacade.addProduct(businessId, value.name.toString().toLowerCase(), value.description.toString().toLowerCase(),parseInt(value.duration) );
        await this.presentSuccess();
      } finally {
        await this.loader.hideLoader();
      }

      await this.ctrl.dismiss({ done: true, values: this.productForm.value });
      this.submitClicked = false;
    }
  }

  async presentSuccess() {
    await this.alertService.presentSimpleAlert(
      'Confirmación',
      'Producto añadido con éxito.',
    );
  }
}
