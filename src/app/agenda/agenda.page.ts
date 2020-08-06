import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Agenda } from '../interfaces/agenda';
import { AgendaService } from '../services/agenda.service';
import { AuthService } from '../services/auth.service';
import { AddAgendaPage } from './add-agenda/add-agenda.page';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private service: AgendaService,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private auth: AuthService,
  ) {}

  agendas$: Observable<Agenda[]>;
  loading: boolean = false;

  ngOnInit() {
    this.agendas$ = this.auth.user$.pipe(
      switchMap(user => {
        if (user) {
          return this.service.getBusinessAgenda(user.businessId); // user de momento tiene un businessId
        } else {
          return of(null);
        }
      }),
    );
  }

  async showAgenda() {
    await this.router.navigate(['details'], { relativeTo: this.route });
  }

  async addAgenda() {
    const modal = await this.modalController.create({
      component: AddAgendaPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.parentOutlet.nativeEl,
      cssClass: 'half-screen-modal',
    });

    await modal.present();
  }
}
