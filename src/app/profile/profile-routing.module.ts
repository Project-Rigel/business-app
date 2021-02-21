import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileResolver } from './resolvers/profile.resolver';
import { ProfilePage } from './views/profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    resolve: {
      user: ProfileResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
