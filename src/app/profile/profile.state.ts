import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable()
export class ProfileState {
  private updating$ = new BehaviorSubject<boolean>(false);
  private profileData$ = new BehaviorSubject<User>(null);

  isUpdating$() {
    return this.updating$.asObservable();
  }

  setUpdating$(isUpdating: boolean) {
    this.updating$.next(isUpdating);
  }

  getProfileData$() {
    return this.profileData$.asObservable();
  }

  setProfileData(user: User) {
    this.profileData$.next(user);
  }
}
