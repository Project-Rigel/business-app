import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {
  constructor(private httpClient: HttpClient) {
    this.agendas = [];
  }

  agendas;

  ngOnInit() {
    this.httpClient
      .get('https://picsum.photos/v2/list')
      .subscribe(res => this.agendas = res);
  }

  showAgenda() {}

  edit() {}
}
