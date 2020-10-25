import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendaListPage } from './views/agenda-list.page';

const routes: Routes = [
  {
    path: '',
    component: AgendaListPage,
  },
  {
    path: 'details',
    loadChildren: () =>
      import('./modules/agenda-details/agenda-details.module').then(
        m => m.AgendaDetailsPageModule,
      ),
  },
  {
    path: 'add-agenda-list',
    loadChildren: () =>
      import('../add-agenda/add-agenda/add-agenda.module').then(m => m.AddAgendaPageModule),
  },
  {
    path: 'add-agenda-list-config',
    loadChildren: () => import('../add-agenda/add-agenda-config/add-agenda-config.module').then(m => m.AddAgendaConfigPageModule)
  },
  {
    path: 'add-agenda-list-basic-info',
    loadChildren: () => import('../add-agenda/add-agenda-basic-info/add-agenda-basic-info.module').then(m => m.AddAgendaBasicInfoPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendaPageRoutingModule {}
