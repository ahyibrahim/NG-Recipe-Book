import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, tap, throwError} from "rxjs";
import {User} from "./user.model";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

export interface AuthResponseData{
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId : string;
  registered? : boolean
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null);
  private expirationTimeout: any;

  private SIGNUP_URL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='
  private LOGIN_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='

  constructor(private http: HttpClient, private router: Router) {

  }

  signUp(user: { email: string, password: string }){
    return this.http.post<AuthResponseData>(this.SIGNUP_URL.concat(environment.FIREBASE_API_KEY),
      {
        ...user,
        returnSecureToken: true
      }
      ).pipe(
          catchError(this.errorHandle),
          tap(resData => {
            this.handleAuth(
              resData.email,
              resData.localId,
              resData.idToken,
              +resData.expiresIn)
          })
       );
  }

  signIn(user: {email: string, password: string}){
    return this.http.post<AuthResponseData>(this.LOGIN_URL.concat(environment.FIREBASE_API_KEY),
      {
        ...user,
        returnSecureToken: true
      }
      ).pipe(
          catchError(this.errorHandle),
      tap(resData => {
        this.handleAuth(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn)
      })
       )
  }

  logout(){
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
    if (this.expirationTimeout){
      clearTimeout(this.expirationTimeout)
    }
    this.expirationTimeout = null;
  }

  private handleAuth(email: string, localId: string, idToken: string, expiresIn: number){
    const newUser = new User(
      email,
      localId,
      idToken,
      new Date(new Date().getTime() + expiresIn * 1000))
    console.log(`nexting user: ${newUser.email}\t${newUser.id}`)
    this.user.next(newUser)
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(newUser));
  }

  private errorHandle(err){
    let errorMessage = "An unknown error has occurred!";
    if(!err.error || !err.error.error){
      return throwError(() => errorMessage)
    }
    switch (err.error.error.message){
      case 'EMAIL_EXISTS':
        errorMessage = "A user associated with that email already exists!"
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = "Email Not Found!";
        break;
      case 'INVALID_PASSWORD':
        errorMessage = "Incorrect Password!";
        break;
      case 'USER_DISABLED':
        errorMessage = "The user account has been disabled by an administrator";
        break;
    }
    return throwError(() => errorMessage);
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpiration: string
    } = JSON.parse(localStorage.getItem('userData'));
    if(userData){
      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpiration)
      );

      if(loadedUser.token){
        this.user.next(loadedUser);
        const expirationDuration = new Date(userData._tokenExpiration).getTime() - new Date().getTime();
      }

    }else{
      return;
    }
  }

  autoLogout(expirationDate: number){
    this.expirationTimeout = setTimeout(()=>{
      this.logout();
    }, expirationDate)
  }
}
