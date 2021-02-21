import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileFacade } from './profile.facade';
import { ProfileState } from './profile.state';
import { ProfileResolver } from './resolvers/profile.resolver';
import { ProfileApiService } from './services/profile-api.service';
import { ProfilePage } from './views/profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ProfileRoutingModule,
  ],
  declarations: [ProfilePage],
  providers: [ProfileState, ProfileFacade, ProfileResolver, ProfileApiService],
})
export class ProfileModule {}
