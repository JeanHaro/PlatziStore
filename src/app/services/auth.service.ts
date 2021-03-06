import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

import { tap, switchMap } from 'rxjs/operators';

// Interfaces
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';

// Servicios
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // API
  private apiUrl = `${environment.API_URL}/api/auth`;

  // Le decimos que es un BehaviorSubject, y le decimos que tiene ese behavior y le decimos que tiene un array
  private user = new BehaviorSubject<User | null>(null) 

  // Un observable se caracteriza por tener un signo de pesos al final
  // Cada vez que agreguemos productos a los que estén suscritos puedan recibir esas notificaciones
  user$ = this.user.asObservable();

  constructor (
    private http: HttpClient,
    private TokenService: TokenService
  ) { }

  // Iniciar sesion
  login (email: string, password: string) {
    // Queremos que nos retorne la interface Auth cuando hagamos el post
    return this.http.post<Auth>(`${this.apiUrl}/login`, {email, password})
    .pipe(
      // Guarda el accesToken
      tap(response => this.TokenService.saveToken(response.access_token))
      );
  }

  // Perfil del usuario
  // getProfile (token: string)
  getProfile() {
    // Forma 2
    // const headers = new HttpHeaders();
    // Enviamos la autorizacion y el valor
    // headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}/profile`, {
      /* headers: {
        // Forma 1
        Authorization: `Bearer ${token}`,
        // 'Content-type': 'application/json'
      } */
    })
    .pipe(
      // switchMap - hace cambios de observadores
      // Una vez que se loguee obtenga el perfil y guarda ese estado
      tap(user => this.user.next(user))
    )
  }
  
  // Iniciar sesion y obtener
  logininAndGet (email: string, password: string) {
    return this.login(email, password)
    .pipe(
      switchMap(() => this.getProfile())
    )
  }

  logout() {
    this.TokenService.removeToken();
  }
}
