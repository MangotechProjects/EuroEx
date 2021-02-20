import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as jwt_decode from 'jwt-decode';
// @ts-ignore  
//import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public jwtHelper: JwtHelperService) {}
  // ...
  // public isAuthenticated(): boolean {
  //   const token = localStorage.getItem('token');
  //   //console.log(token);
  
  //   var decoded = jwt_decode(token);
  //   console.log(decoded);


  //   // var decodedHeader = jwt_decode(token, { header: true });
  //   // console.log(decodedHeader);

  //   // Check whether the token is expired and return
  //   // true or false
  //   return !this.jwtHelper.isTokenExpired(decoded);
  // }
}
