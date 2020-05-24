import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AgendaService } from '../services/agenda.service';
import { IonRouterOutlet, IonTabBar, ModalController } from '@ionic/angular';
import { AddAgendaPage } from './add-agenda/add-agenda.page';
import { AuthService } from '../services/auth.service';
import { switchMap } from 'rxjs/operators';
import { Agenda } from '../interfaces/agenda';

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
          return this.service.getBusinessAgenda(user.id);
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
