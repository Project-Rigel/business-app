import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';


const routes: Routes = [

  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  }, {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'notifications',
        children: [
          {
            path: '',
            loadChildren: () => import('../notifications/notifications.module').then(m => m.NotificationsPageModule),
          },
        ],
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule),
          },
        ],
      },
      {
        path: 'customers',
        children: [
          {
            path: '',
            loadChildren: () => import('../customers/customers.module').then(m => m.CustomersPageModule),
          },
        ],
      },

      {
        path: '',
        redirectTo: 'customers',
        pathMatch: 'full',
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {
}

