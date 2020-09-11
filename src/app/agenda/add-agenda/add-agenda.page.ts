import { Component, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import {
  IonInput,
  ModalController,
  PickerController,
  Platform,
} from '@ionic/angular';
import { take } from 'rxjs/operators';
import { AgendaService } from '../../services/agenda.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-agenda',
  templateUrl: './add-agenda.page.html',
  styleUrls: ['./add-agenda.page.scss'],
})
export class AddAgendaPage {
  form: FormGroup;
  minuteSelected = '30';
  minutes = ['15', '30', '60', '120'];
  loading = false;
  imageUrl;

  @ViewChild('inputNombre') input: IonInput;
  constructor(
    private formBuilder: FormBuilder,
    private imagePicker: ImagePicker,
    private pickerController: PickerController,
    private modalController: ModalController,
    private agendaService: AgendaService,
    private platform: Platform,
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private auth: AuthService,
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  ionViewDidEnter() {
    setTimeout(() => this.input.setFocus(), 100);
  }

  async createAgenda() {
    this.auth.user$.pipe(take(1)).subscribe(async user => {
      this.loading = true;
      const id = this.afs.createId();

      let imageUrl: string = null;
      if (this.imageUrl) {
        const task = await this.storage
          .ref(id)
          .putString(this.imageUrl, 'base64');

        imageUrl = await task.ref.getDownloadURL();
      }

      await this.agendaService.addAgenda(
        id,
        this.form.get('name').value,
        this.minuteSelected,
        imageUrl,
        user.businessId, // Esto tiene que ser el id de el bussiness
      );

      await this.modalController.dismiss({});

      this.loading = false;
    });
  }

  async selectImage(event) {
    if (this.platform.is('cordova')) {
      try {
        const pictures = await this.imagePicker.getPictures({ outputType: 1 });
        console.log(pictures);

        if (pictures) {
          this.imageUrl = pictures[0];
        }
      } catch (e) {
        console.log(e);
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

  async closeModal() {
    await this.modalController.dismiss({});
    this.form.reset();
  }
  get name() {
    return this.form.get('name');
  }
}
