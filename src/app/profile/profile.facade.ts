import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ProfileState } from './profile.state';
import { ProfileApiService } from './services/profile-api.service';

@Injectable()
export class ProfileFacade {
  constructor(
    private apiService: ProfileApiService,
    private state: ProfileState,
  ) {}

  loadProfileData$() {
    return this.apiService
      .getProfileData('WOkp7Kkin8QogWMvFZKeHZars1X2')
      .pipe(tap(val => this.state.setProfileData(val)));
  }
}
