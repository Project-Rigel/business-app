import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
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
  businessAddress: any;
  businessPhoneNumber: number;

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private keyboard: Keyboard,
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
    await this.authService.verifyPhoneNumber(code).then(async success => {
      if (success) {
        // save business

        await this.modalController.dismiss({
          done: true,
          values: {
            name: this.businessName,
            nif: this.businessNIF,
            address: this.businessAddress,
            phone: this.businessPhoneNumber,
          },
        });
      } else {
        await this.cancel();
      }
    });
  }

  async nextSlide() {
    await this.ionSlides.lockSwipeToNext(false);
    await this.ionSlides.slideNext(600);
    await this.ionSlides.lockSwipes(false);
    await this.ionSlides.lockSwipeToNext(true);
    await this.keyboard.hide(); // For cordova, to prevent going to the nextSlide with 'enter'
  }

  async cancel() {
    await this.modalController.dismiss({ done: false });
  }
}
