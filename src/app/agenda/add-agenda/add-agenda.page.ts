import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { IonInput, ModalController, PickerController, Platform } from '@ionic/angular';
import { AgendaService } from '../../services/agenda.service';

@Component({
  selector: 'app-add-agenda',
  templateUrl: './add-agenda.page.html',
  styleUrls: ['./add-agenda.page.scss'],
})
export class AddAgendaPage implements OnInit {
  form: FormGroup;
  minuteSelected: string = '30';
  minutes = ['15', '30', '60', '120'];
  loading = false;
  @ViewChild('inputNombre', { static: false }) input: IonInput;
  constructor(
    private formBuilder: FormBuilder,
    private imagePicker: ImagePicker,
    private pickerCOntroller: PickerController,
    private modalController: ModalController,
    private agendaService: AgendaService,
    private platform: Platform
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  ionViewDidEnter() {
    setTimeout(() => this.input.setFocus(), 100);
  }

  async createAgenda(){
    // this.loading = true;
    // this.agendaService.addAgenda()
    await this.modalController.dismiss({});
  }

  async selectImage(event){
    if(this.platform.is("cordova")){
      const pictures = await this.imagePicker.getPictures({});
      console.log(pictures);
    }else{
      console.log(event);
    }
  }
  async showPicker() {
    const picker = await this.pickerCOntroller.create({
      columns: [
        {
          name: 'Minutes',
          options: this.getColumnOptions(),
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: value => {
            if(value.Minutes.value){
              console.log(value.Minutes.value);

              this.minuteSelected = value.Minutes.value;
            }
          },
        },
      ],
    });

    await picker.present();
  }

  private getColumnOptions() {
    let options = [];
    this.minutes.forEach(x => {
      if (x === this.minuteSelected) {
        options.push({ text: x + " minutes", value: x, selected: true });
      } else {
        options.push({ text: x + " minutes", value: x });
      }
    });
    return options;
  }

  get name(){
    return this.form.get("name");
  }

}
