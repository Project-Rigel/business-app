import { Injectable } from "@angular/core";
import { distinctUntilChanged, filter, switchMap, tap } from "rxjs/operators";
import { ProfileState } from "./profile.state";
import { ProfileApiService } from "./services/profile-api.service";
import { UserState } from "../core/user/user.state";

@Injectable()
export class ProfileFacade {
  constructor(
    private apiService: ProfileApiService,
    private state: ProfileState,
    private userState: UserState
  ) {
  }

  loadProfileData$() {
    return this.userState
      .getUser$()
      .pipe(
        filter(user => user !== null),
        distinctUntilChanged(),
        switchMap(user =>
          this.apiService
            .getProfileData(user.id)
            .pipe(tap(val => this.state.setProfileData(val)))
        )
      );
  }
}
