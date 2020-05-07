import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { map, take, tap } from 'rxjs/operators';
import { loggedIn } from '@angular/fire/auth-guard';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private router: Router,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {

    return this.authService.user$.pipe(take(1), map(user => !!user), tap(loggedIn => {
      if (!loggedIn) {
        console.log('access denied');
        this.router.navigate(['login']);
      }
    }));
  }
}
