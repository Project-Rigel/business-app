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
import { AlertController, IonInput } from '@ionic/angular';
import { NifValidatorService } from '../../../services/nif-validator.service';

@Component({
  selector: 'app-business-cif-slide',
  templateUrl: './business-cif-slide.component.html',
  styleUrls: ['./business-cif-slide.component.scss'],
})
export class BusinessCifSlideComponent implements OnInit {
  @Output() onBusinessCIFChosen = new EventEmitter<string>();
  @ViewChild('businessCIF') input: IonInput;
  businessCIFForm: FormGroup;
  submitEnabled = true;
  submitClicked = false;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.businessCIFForm = this.formBuilder.group({
      cif: ['', [Validators.required, NifValidatorService.valid_NIF_NIE_CIF()]],
    });
  }

  async submitForm(value: any) {
    this.submitClicked = true;
    if (!this.businessCIFForm.valid) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Tiene que indicar un NIF/NIE/CIF correcto',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      this.submitEnabled = false;
      this.submitClicked = false;
      this.onBusinessCIFChosen.emit(this.cif.value);
    }
  }

  get cif() {
    return this.businessCIFForm.get('cif');
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
