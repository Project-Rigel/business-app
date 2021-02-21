import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendaListPage } from './views/agenda-list.page';
import { AgendaListResolver } from './resolvers/agenda-list.resolver';

const routes: Routes = [
  {
    path: '',
    component: AgendaListPage,
    resolve: {
      agendasList: AgendaListResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendaPageRoutingModule {}
