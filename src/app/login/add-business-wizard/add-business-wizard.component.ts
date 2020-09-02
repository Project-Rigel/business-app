import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-business-wizard',
  templateUrl: './add-business-wizard.component.html',
  styleUrls: ['./add-business-wizard.component.scss'],
})
export class AddBusinessWizardComponent implements AfterViewInit {
  @ViewChild(IonSlides) ionSlides: IonSlides;
  slideOpts: any = {};
  businessName: string;
  businessNIF: string;
  businessAddress: string;
  businessPhoneNumber: number;

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
  ) {}

  //ngOnInit() {}

  async ngAfterViewInit(): Promise<void> {
    await this.ionSlides.lockSwipes(true);
  }

  async saveBusinessName(name) {
    this.businessName = name;
    await this.nextSlide();
  }

  async saveBusinessNIF(nif) {
    this.businessNIF = nif;
    await this.nextSlide();
  }

  async saveBusinessAddress(address) {
    this.businessAddress = address;
    await this.nextSlide();
  }

  async saveBusinessPhone(phone) {
    this.businessPhoneNumber = phone;
    await this.authService.sendPhoneVerificationCode(phone);
    await this.nextSlide();
  }

  async checkVerificationCode(code) {
    await this.authService.verifyPhoneNumber(code).then(success => {
      if (success) {
        console.log('Hecho');
        // this.ionSlides.slideTo(1, 600)
      } else {
        console.log('Código incorrecto');
      }
    });
  }

  async nextSlide() {
    await this.ionSlides.lockSwipeToNext(false);
    await this.ionSlides.slideNext(600);
    await this.ionSlides.lockSwipes(false);
    await this.ionSlides.lockSwipeToNext(true);
  }

  async cancel() {
    await this.modalController.dismiss({ done: false });
  }
}
