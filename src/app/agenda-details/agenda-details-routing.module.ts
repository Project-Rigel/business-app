import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendaDetailsPage } from './agenda-details.page';

const routes: Routes = [
  {
    path: ':id',
    component: AgendaDetailsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendaDetailsPageRoutingModule {}
