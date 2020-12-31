import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ModalController } from '@ionic/angular';
import { AlertService } from '../../../services/alert.service';
import { ErrorToastService } from '../../../services/error-toast.service';
import { LoaderService } from '../../../services/loader.service';
import { ProductsFacade } from '../../products.facade';
import { ProductsState } from '../../products.state';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product-container.component.html',
  styleUrls: ['./add-product-container.component.scss'],
})
export class AddProductContainerComponent implements OnInit {
  productForm: FormGroup;
  isFormSubmitEnabled = true;
  static readonly TIME_TO_CLOSE_KEYBOARD: number = 100;

  constructor(
    private ctrl: ModalController,
    private formBuilder: FormBuilder,
    private keyboard: Keyboard,
    private loader: LoaderService,
    private alertService: AlertService,
    private productFacade: ProductsFacade,
    private errorToastService: ErrorToastService
  ) {}

  async ngOnInit() {
    // this.keyboard.show(); TODO this only shows in android. In Ios just need to focus the element

    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      duration: ['', [Validators.required]],
    });
  }

  async cancelSubmission() {
    this.isFormSubmitEnabled = false;
    this.keyboard.hide();
    try {
      await this.errorToastService.dismiss();
    } finally {
      setTimeout(async () => {
        await this.ctrl.dismiss({ done: false });
        this.isFormSubmitEnabled = true;
      }, AddProductContainerComponent.TIME_TO_CLOSE_KEYBOARD);
    }
  }

  async submitProduct(value: any, businessId: string) {
    this.productFacade.setUpdating(true);

    if (!this.productForm.valid) {
      await this.alertService.presentSimpleAlert("Error", "Introduzca los datos correctamente");
    } else {
      await this.loader.showLoader();
      this.keyboard.hide();
      try {
        this.productFacade.addProduct(businessId, value.name.toString().toLowerCase(), value.description.toString().toLowerCase(),parseInt(value.duration) );
        await this.alertService.presentSimpleAlert(
          'Confirmación',
          'Producto añadido con éxito.',
        );
      } finally {
        await this.loader.hideLoader();
        this.productFacade.setUpdating(false);
      }

      await this.ctrl.dismiss({ done: true, values: this.productForm.value });
    }
  }
}
