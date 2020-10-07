import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendaPage } from './agenda.page';

const routes: Routes = [
  {
    path: '',
    component: AgendaPage,
  },
  {
    path: 'details',
    loadChildren: () =>
      import('./agenda-details/agenda-details.module').then(
        m => m.AgendaDetailsPageModule,
      ),
  },
  {
    path: 'add-agenda',
    loadChildren: () =>
      import('./add-agenda/add-agenda.module').then(m => m.AddAgendaPageModule),
  },  {
    path: 'add-agenda-config',
    loadChildren: () => import('./add-agenda-config/add-agenda-config.module').then( m => m.AddAgendaConfigPageModule)
  },
  {
    path: 'add-agenda-basic-info',
    loadChildren: () => import('./add-agenda-basic-info/add-agenda-basic-info.module').then( m => m.AddAgendaBasicInfoPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendaPageRoutingModule {}
