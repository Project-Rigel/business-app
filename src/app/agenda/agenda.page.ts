import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {
  constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute) {
  }
  loadedImages = 0;
  agendas$: Observable<any>;
  loading: boolean = false;

  ngOnInit() {
      this.agendas$ = this.httpClient
        .get('https://picsum.photos/v2/list');


  }

  showAgenda() {
    this.router.navigate(["details"], {relativeTo: this.route});
  }

}
