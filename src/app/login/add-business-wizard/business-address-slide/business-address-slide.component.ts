import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { ErrorToastService } from '../../../services/error-toast.service';

@Component({
  selector: 'app-business-address-slide',
  templateUrl: './business-address-slide.component.html',
  styleUrls: ['./business-address-slide.component.scss'],
})
export class BusinessAddressSlideComponent implements OnInit {
  @Output() onBusinessAddressChosen = new EventEmitter<string>();
  @ViewChild('businessAddress') input: IonInput;
  businessAddressForm: FormGroup;
  submitEnabled = true;
  submitClicked = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastService: ErrorToastService,
  ) {}

  ngOnInit() {
    this.businessAddressForm = this.formBuilder.group({
      address: ['', [Validators.required]],
    });
  }

  async submitForm(value: any) {
    this.submitClicked = true;
    if (!this.businessAddressForm.valid) {
      await this.toastService.present({
        message: 'Error Tiene que indicar una dirección',
        color: 'danger',
      });
    } else {
      this.submitEnabled = false;
      this.submitClicked = false;
      this.onBusinessAddressChosen.emit(this.address.value);
    }
  }

  get address() {
    return this.businessAddressForm.get('address');
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
