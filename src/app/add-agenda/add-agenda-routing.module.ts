import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAgendaPage } from './views/add-agenda/add-agenda.page';

const routes: Routes = [
  {
    path: '',
    component: AddAgendaPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAgendaPageRoutingModule {}
