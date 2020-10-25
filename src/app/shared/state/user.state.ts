import { BehaviorSubject } from 'rxjs';
import { User } from '../../interfaces/user';

export class UserState{
  private user$ = new BehaviorSubject<User>(null);

  getUser$(){
    return this.user$.asObservable();
  }

  setUser$(user: User){
    this.user$.next(user);
  }

}
