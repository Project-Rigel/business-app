import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  userForm;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      email: '',
      password: '',
      fullName: '',
    });
  }

  async registerUser() {
    await this.authService.createUser(
      this.userForm.value.email,
      this.userForm.value.password,
    );
  }

  async logOut() {
    await this.authService.logOut();
  }

  async loginWithGoogle() {
    await this.authService.loginWithGoogle();
    await this.router.navigate(['app','tabs']);
  }

}
