import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { ModalController, PickerController, Platform } from "@ionic/angular";
import { AgendaService } from "../../services/agenda.service";

@Component({
  selector: 'app-add-agenda-basic-info',
  templateUrl: './add-agenda-basic-info.page.html',
  styleUrls: ['./add-agenda-basic-info.page.scss'],
})
export class AddAgendaBasicInfoPage implements OnInit {
  imageUrl;
  minutes = ['15', '30', '60', '120'];
  minuteSelected = '30';
  @Input() form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private imagePicker: ImagePicker,
    private pickerController: PickerController,
    private modalController: ModalController,
    private agendaService: AgendaService,
    private platform: Platform,
  ) {
  }

  ngOnInit() {}

  async selectImage(event) {
    if (this.platform.is('cordova')) {
      try {
        const pictures = await this.imagePicker.getPictures({ outputType: 1 });

        if (pictures) {
          this.imageUrl = pictures[0];
        }
      } catch (e) {
        throw e;
      }
    } else {
      console.log(event);
    }
  }
  async showPicker() {
    const picker = await this.pickerController.create({
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
            if (value.Minutes.value) {
              this.minuteSelected = value.Minutes.value;
            }
          },
        },
      ],
    });

    await picker.present();
  }
   private getColumnOptions() {
    const options = [];
    this.minutes.forEach(x => {
      if (x === this.minuteSelected) {
        options.push({ text: x + ' minutes', value: x, selected: true });
      } else {
        options.push({ text: x + ' minutes', value: x });
      }
    });
    return options;
  }

}
