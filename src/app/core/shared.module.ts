import { NgModule } from "@angular/core";
import { UserState } from "./user/user.state";
import { AuthService } from "../services/auth.service";

@NgModule({
  declarations: [],
  imports: [],
  providers: [UserState, AuthService]
})
export class AppSharedModule {
}
