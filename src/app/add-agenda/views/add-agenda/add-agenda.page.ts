import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput, IonSlides, ModalController } from '@ionic/angular';
import { Configuration } from '../../../interfaces/configuration';
import { Config } from '../../../services/set-agenda-config-bulk.service';

@Component({
  selector: 'app-add-agenda',
  templateUrl: './add-agenda.page.html',
  styleUrls: ['./add-agenda.page.scss'],
})
export class AddAgendaPage {
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
    private modalController: ModalController /*    private agendaService: AgendaService,
        private platform: Platform,
        private storage: AngularFireStorage,
        private afs: AngularFirestore,
        private auth: AuthService,
        private loader: LoaderService,
        private setAgendaBulkService: SetAgendaConfigBulkService,
        private dayOfWeekService: DayOfWeekTranslatorService,
        private addAgendaFacade: AddAgendaFacade*/,
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  async ionViewDidEnter() {
    await this.ionSlides.lockSwipeToNext(true);
    await this.ionSlides.lockSwipeToPrev(true);
  }

  changedConfigurations(event: Configuration[]) {
    this.configurations = event;
  }

  async createAgenda() {
    /*await this.loader.showLoader();
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

        if (this.configurations.length > 0) {
          const confs: {
            [date: string]: Config;
          } = this.mapUserConfigurationsIntoDto();

          const configs: Config[] = Object.keys(confs).map(key => {
            return confs[key];
          });

          await this.setAgendaBulkService
            .endpoint({
              agendaId: id,
              businessId: user.businessId,
              configs,
            })
            .subscribe(res => console.log(res));
        }

        await this.loader.hideLoader();
        await this.modalController.dismiss({});

        this.loading = false;
      },

      () => {
        this.loader.hideLoader();
      },
    );*/
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
    /*this.configurations.map((intervalConfiration: Configuration) => {
      if (intervalConfiration.specificDate) {
        // Si es specifica
        if (confs[intervalConfiration.specificDate.getTime()]) {
          // Si ya existe
          confs[intervalConfiration.specificDate.getTime()].intervals.push({
            startHour: moment(intervalConfiration.startTime.toISOString())
              .utc()
              .format('HH:mm'),
            endHour: moment(intervalConfiration.endTime.toISOString())
              .utc()
              .format('HH:mm'),
          });
        } else {
          // Si no existe
          confs[intervalConfiration.specificDate.getTime()] = {
            expirationDate: null,
            specificDate: intervalConfiration.specificDate.toISOString(),
            dayOfWeek: null,
            intervals: [
              {
                startHour: moment(intervalConfiration.startTime.toISOString())
                  .utc()
                  .format('HH:mm'),
                endHour: moment(intervalConfiration.endTime.toISOString())
                  .utc()
                  .format('HH:mm'),
              },
            ],
          };
        }
      } else {
        // Si es semanal
        if (confs[intervalConfiration.day]) {
          // Si ya existe
          confs[intervalConfiration.day].intervals.push({
            startHour: moment(intervalConfiration.startTime.toISOString())
              .utc()
              .format('HH:mm'),
            endHour: moment(intervalConfiration.endTime.toISOString())
              .utc()
              .format('HH:mm'),
          });
        } else {
          // Si no existe
          confs[intervalConfiration.day] = {
            expirationDate: new Date().toISOString(),
            specificDate: null,
            dayOfWeek: this.dayOfWeekService.translateDayInto(intervalConfiration.day, "EN"),
            intervals: [
              {
                startHour: moment(intervalConfiration.startTime.toISOString())
                  .utc()
                  .format('HH:mm'),
                endHour: moment(intervalConfiration.endTime.toISOString())
                  .utc()
                  .format('HH:mm'),
              },
            ],
          };
        }
      }
    });*/
    return confs;
  }
}
