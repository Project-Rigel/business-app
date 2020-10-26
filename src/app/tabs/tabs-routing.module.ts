import { NgModule } from '@angular/core';
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const redirectToLogin = () => redirectUnauthorizedTo(['app/login']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    component: TabsPage,
    data: { authGuardPipe: redirectToLogin },
    children: [
      {
        path: 'notifications',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../notifications/notifications.module').then(
                m => m.NotificationsPageModule,
              ),
          },
        ],
      },
      {
        path: 'agenda-list',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../agenda-list/agenda-list.module').then(m => m.AgendaListModule),
          },
        ],
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../profile/profile.module').then(
                m => m.ProfilePageModule,
              ),
          },
        ],
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../products/products.module').then(
                m => m.ProductsPageModule,
              ),
          },
        ],
      },
      {
        path: 'customers',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../customers/customers.module').then(
                m => m.CustomersPageModule,
              ),
          },
        ],
      },

      {
        path: '',
        redirectTo: 'agenda-list',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
