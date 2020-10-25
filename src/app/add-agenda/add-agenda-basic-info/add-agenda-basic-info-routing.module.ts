import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAgendaBasicInfoPage } from './add-agenda-basic-info.page';

const routes: Routes = [
  {
    path: '',
    component: AddAgendaBasicInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAgendaBasicInfoPageRoutingModule {}
