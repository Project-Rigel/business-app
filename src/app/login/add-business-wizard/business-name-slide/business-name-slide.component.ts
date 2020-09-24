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
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-business-name-slide',
  templateUrl: './business-name-slide.component.html',
  styleUrls: ['./business-name-slide.component.scss'],
})
export class BusinessNameSlideComponent implements OnInit {
  @Output() onBusinessNameChosen = new EventEmitter<string>();
  @ViewChild('businessName') input: IonInput;
  businessNameForm: FormGroup;
  submitEnabled = true;
  submitClicked = false;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.businessNameForm = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  async submitForm(value: any) {
    this.submitClicked = true;
    if (!this.businessNameForm.valid) {
      await this.alertService.presentSimpleAlert(
        'Error',
        'Tiene que indicar un nombre',
      );
    } else {
      this.submitEnabled = false;
      this.submitClicked = false;
      this.onBusinessNameChosen.emit(this.name.value);
    }
  }

  get name() {
    return this.businessNameForm.get('name');
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
