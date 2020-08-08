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
    canActivate: [AngularFireAuthGuard],
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
        path: 'agenda',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../agenda/agenda.module').then(m => m.AgendaPageModule),
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
        redirectTo: 'agenda',
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
