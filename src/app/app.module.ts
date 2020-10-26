import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { ScreenTrackingService } from '@angular/fire/analytics';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { REGION } from '@angular/fire/functions';
import { AngularFirePerformanceModule } from '@angular/fire/performance';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import 'reflect-metadata';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaginationService } from './services/pagination-service.service';
import { AddAgendaPageModule } from './add-agenda/add-agenda/add-agenda.module';
// import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';

registerLocaleData(localeES, 'es');

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirePerformanceModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireAuthGuardModule,
    AddAgendaPageModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    StatusBar,
    GooglePlus,
    SplashScreen,
    PaginationService,
    ScreenTrackingService,
    Keyboard,
    ImagePicker,
    FirebaseAuthentication,
    // SmsRetriever,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: REGION, useValue: 'europe-west1' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
