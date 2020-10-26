import { BehaviorSubject } from 'rxjs';
import { User } from '../../interfaces/user';
import { Injectable } from '@angular/core';

@Injectable()
export class UserState{
  private user$ = new BehaviorSubject<User>(null);

  getUser$(){
    return this.user$.asObservable();
  }

  setUser$(user: User){
    this.user$.next(user);
  }

}
