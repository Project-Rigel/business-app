import { Component, ViewChild } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IonInput, IonSlides, ModalController, Platform } from "@ionic/angular";
import { take } from "rxjs/operators";
import { AgendaService } from "../../services/agenda.service";
import { AuthService } from "../../services/auth.service";

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
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  async ionViewDidEnter() {
    //setTimeout(() => this.input.setFocus(), 100);
    await this.ionSlides.lockSwipeToNext(true);
    await this.ionSlides.lockSwipeToPrev(true);
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
  }

  async previousSlide(): Promise<void> {
    await this.ionSlides.lockSwipeToPrev(false);
    await this.ionSlides.slidePrev();
  }
}
