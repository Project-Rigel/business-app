import { Component, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput, IonSlides, ModalController, Platform } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { Configuration } from '../../interfaces/configuration';
import { AgendaService } from '../../services/agenda.service';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import {
  Config,
  SetAgendaConfigService,
} from '../../services/set-agenda-config.service';

@Component({
  selector: 'app-add-agenda',
  templateUrl: './add-agenda.page.html',
  styleUrls: ['./add-agenda.page.scss'],
})
export class AddAgendaPage {
  englishDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  spanishDays = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  form: FormGroup;
  minuteSelected = '30';
  loading = false;
  imageUrl;
  canSaveAgenda = false;
  configurations: Configuration[] = [];
  @ViewChild('inputNombre') input: IonInput;
  @ViewChild(IonSlides) ionSlides: IonSlides;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private agendaService: AgendaService,
    private platform: Platform,
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private auth: AuthService,
    private loader: LoaderService,
    private setAgendaService: SetAgendaConfigService,
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  async ionViewDidEnter() {
    await this.ionSlides.lockSwipeToNext(true);
    await this.ionSlides.lockSwipeToPrev(true);
  }

  changedConfigrations(event: Configuration[]) {
    this.configurations = event;
  }

  async createAgenda() {
    await this.loader.showLoader();
    this.auth.user$.pipe(take(1)).subscribe(
      async user => {
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
          user.businessId,
        );

        //////////////////////////////////////////////////////
        if (this.configurations.length > 0) {
          const confs: {
            [date: string]: Config;
          } = this.mapUserConfigurationsIntoDto();
          for (const key in confs) {
            console.log('hola');
            await this.setAgendaService
              .endpoint({
                agendaId: id,
                businessId: user.businessId,
                dayOfWeek: confs[key].dayOfWeek,
                specificDate: confs[key].specificDate,
                expirationDate: confs[key].expirationDate,
                intervals: confs[key].intervals,
              })
              .subscribe(res => console.log(res));
          }
        }
        /////////////////////////////////////////////

        await this.loader.hideLoader();
        await this.modalController.dismiss({});

        this.loading = false;
      },

      err => {
        this.loader.hideLoader();
      },
    );
  }

  async closeModal() {
    await this.modalController.dismiss({});
    this.form.reset();
  }

  get name() {
    return this.form.get('name');
  }

  async nextSlide() {
    await this.ionSlides.lockSwipeToNext(false);
    await this.ionSlides.slideNext();
    this.canSaveAgenda = true;
  }

  async previousSlide(): Promise<void> {
    await this.ionSlides.lockSwipeToPrev(false);
    await this.ionSlides.slidePrev();
    this.canSaveAgenda = false;
  }

  mapUserConfigurationsIntoDto(): { [date: string]: Config } {
    const confs: { [date: string]: Config } = {};
    this.configurations.map((intervalConfiration: Configuration) => {
      if (intervalConfiration.specificDate) {
        // Si es specifica
        if (confs[intervalConfiration.specificDate.getTime()]) {
          // Si ya existe
          confs[intervalConfiration.specificDate.getTime()].intervals.push({
            startHour: intervalConfiration.startTime
              .toTimeString()
              .substring(0, 5),
            endHour: intervalConfiration.startTime
              .toTimeString()
              .substring(0, 5),
          });
        } else {
          // Si no existe
          confs[intervalConfiration.specificDate.getTime()] = {
            expirationDate: new Date().toISOString(), // Cambiar
            specificDate: intervalConfiration.specificDate.toISOString(),
            dayOfWeek: null,
            intervals: [
              {
                startHour: intervalConfiration.startTime
                  .toTimeString()
                  .substring(0, 5),
                endHour: intervalConfiration.startTime
                  .toTimeString()
                  .substring(0, 5),
              },
            ],
          };
        }
      } else {
        // Si es semanal
        if (confs[intervalConfiration.day]) {
          // Si ya existe
          confs[intervalConfiration.day].intervals.push({
            startHour: intervalConfiration.startTime
              .toTimeString()
              .substring(0, 5),
            endHour: intervalConfiration.startTime
              .toTimeString()
              .substring(0, 5),
          });
        } else {
          // Si no existe
          confs[intervalConfiration.day] = {
            expirationDate: new Date().toISOString(), // Cambiar
            specificDate: null,
            dayOfWeek: this.englishDays[
              this.spanishDays.indexOf(intervalConfiration.day)
            ],
            intervals: [
              {
                startHour: intervalConfiration.startTime
                  .toTimeString()
                  .substring(0, 5),
                endHour: intervalConfiration.startTime
                  .toTimeString()
                  .substring(0, 5),
              },
            ],
          };
        }
      }
    });
    return confs;
  }
}
