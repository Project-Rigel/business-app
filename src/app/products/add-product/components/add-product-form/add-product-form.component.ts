import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-add-product-form',
  templateUrl: './add-product-form.component.html',
  styleUrls: ['./add-product-form.component.scss'],
})
export class AddProductFormComponent {

  @ViewChild('productName') input: IonInput;
  submitClicked = false;

  @Input()
  form: FormGroup;

  @Output()
  onNextElementTriggered: EventEmitter<any> = new EventEmitter<any>();

  constructor(    private formBuilder: FormBuilder,
  ) {

  }

  ionViewDidEnter() {
    setTimeout(() => this.input.setFocus(), 100);
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

  get name() {
    return this.form.get('name');
  }
  get description() {
    return this.form.get('description');
  }
  get duration() {
    return this.form.get('duration');
  }

  triggerNextElement(event) {
    this.onNextElementTriggered.emit(event);
  }

  goToNext(event) {
    event.setFocus();
  }
}
