import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthResponse, User } from '../interfaces/interface';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl
  private _user!: User

  get user(){
    return {...this._user}
  }

  constructor(private http: HttpClient) { }

  //REGISTER USER
  register(name: string, email: string, password: string){
    const url = `${this.baseUrl}/register`
    const body = { name, email, password }
    return this.http.post<AuthResponse>(url, body)
        .pipe(
          tap( resp => {
            if(resp.ok){
              //Saving token 
              localStorage.setItem('token', resp.token!);
            }
          }),
          map(valid => valid.ok),
          catchError(err => of(err.error.msg))
        )
  }


  //LOGIN USER
  login(email: string, password: string){
    const url = this.baseUrl
    const body = { email, password};
    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap(({ok, token}) => {
          if(ok){
            //Saving token 
            localStorage.setItem('token', token!);
          }
        }),
        //Response valid or error
        map(valid => valid.ok),
        catchError(err => of(err.error.msg))
      )
  }

  //VALIDATE TOKEN
  validateToken(): Observable<boolean>{
    const url = `${this.baseUrl}/renew`;
    const header = new HttpHeaders().set('x-token', localStorage.getItem('token') || '');
    return this.http.get<AuthResponse>(url, {headers: header})
          .pipe(
            map ( resp => {
              localStorage.setItem('token', resp.token!);
            //Saving user Information with token
            this._user ={
              name: resp.name!,
              uid: resp.uid!,
              email: resp.email!
            }
              return resp.ok
            }),
            catchError(err => of(false))
          );
  }

  //LOGOUT
  logout(){
    localStorage.removeItem('token')
  }
}
