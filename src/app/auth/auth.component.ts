import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthResponseData, AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode = true;
  isLoading=  false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(f: NgForm) {
    const user = {
      email: f.value['email'],
      password : f.value['password']
    };
    console.log(`Email: ${user.email}\tPassword: ${user.password}`);

    let authObs : Observable<AuthResponseData>
    this.isLoading = true;
    if (!this.isLoginMode){
      authObs = this.authService.signUp(user)
    }else{
      authObs = this.authService.signIn(user)
    }
  authObs.subscribe(res => {
      console.log('Sign Up/In Attempt -> ', res);
      this.isLoading = false;
      this.error = null;
      this.router.navigate(['/recipes'])
    }, error => {
      console.log(error);
      this.isLoading = false;
      this.error = error;
    });
    f.reset();
  }
}
