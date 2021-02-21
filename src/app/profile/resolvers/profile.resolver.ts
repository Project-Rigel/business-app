import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { User } from "../../interfaces/user";
import { ProfileFacade } from "../profile.facade";
import { take } from "rxjs/operators";

@Injectable()
export class ProfileResolver implements Resolve<User> {
  constructor(private facade: ProfileFacade) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User> {
    return this.facade.loadProfileData$().pipe(take(1));
  }
}
