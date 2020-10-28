import { Injectable } from "@angular/core";
import { ProductsState } from "./products.state";
import { ProfileApiService } from "../profile/services/profile-api.service";

@Injectable()
export class ProductsFacade {
  constructor(
    private apiService: ProfileApiService,
    private state: ProductsState
  ) {
  }

}
