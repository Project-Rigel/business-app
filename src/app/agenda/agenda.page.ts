import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AgendaService } from '../services/agenda.service';
import { IonRouterOutlet, IonTabBar, ModalController } from '@ionic/angular';
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
  ) {}
  loadedImages = 0;
  agendas$: Observable<any>;
  loading: boolean = false;


  ngOnInit() {
    this.agendas$ = this.httpClient.get('https://picsum.photos/v2/list');
  }

  showAgenda() {
    this.router.navigate(['details'], { relativeTo: this.route });
  }

  async addAgenda() {
    const modal = await this.modalController.create({
      component: AddAgendaPage,
      swipeToClose: true,
      presentingElement: document.getElementById("main-content").parentElement,
      cssClass: "half-screen-modal"
    });


    await modal.present();
  }
}
