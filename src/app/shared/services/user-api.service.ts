import { switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

export class UserApiService{
  constructor(private auth: AuthService) {
  }

  getUser$(){
    return this.auth.user$;
  }
}
