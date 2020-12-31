import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AddAgendaPage } from '../../add-agenda/views/add-agenda/add-agenda.page';
import { Agenda } from '../../interfaces/agenda';
import { AgendaListState } from '../agenda-list.state';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda-list.page.html',
  styleUrls: ['./agenda-list.page.scss'],
})
export class AgendaListPage implements OnInit {
  constructor(
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private agendaListState: AgendaListState,
  ) {}

  agendas$: Observable<Agenda[]>;
  loading = false;

  ngOnInit() {
    this.agendas$ = this.agendaListState.getAgendas$();
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
