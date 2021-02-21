import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { PickerController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { UserState } from '../../../core/user/user.state';

@Component({
  selector: 'app-add-agenda-basic-info',
  templateUrl: './add-agenda-basic-info.page.html',
  styleUrls: ['./add-agenda-basic-info.page.scss'],
})
export class AddAgendaBasicInfoPage {
  imageUrl;
  minutes = ['15', '30', '60', '120'];
  minuteSelected = '30';
  @Input() form: FormGroup;

  constructor(
    private imagePicker: ImagePicker,
    private pickerController: PickerController,
    private userState: UserState,
  ) {}

  async selectImage() {
    this.userState
      .isCordova$()
      .pipe(take(1))
      .subscribe(async isCordova => {
        if (isCordova) {
          try {
            const pictures = await this.imagePicker.getPictures({
              outputType: 1,
            });

            if (pictures) {
              this.imageUrl = pictures[0];
            }
          } catch (e) {
            throw e;
          }
        }
      });
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
