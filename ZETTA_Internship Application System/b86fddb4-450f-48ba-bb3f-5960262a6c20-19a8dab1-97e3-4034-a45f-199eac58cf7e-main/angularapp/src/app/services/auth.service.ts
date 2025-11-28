 
import { Injectable, Optional } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiUrl = environment.apiUrl;
  public currentUserRole = new BehaviorSubject<string | null>(null);
  public isLoggedInApp = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.currentUserRole.next(this.getUserRoleFromToken(token));
    }
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return expiry > now;
    } catch (e) {
      console.error('Error decoding token:', e);
      return false;
    }
  }
  

  login(credentials: { email: string; password: string }): Observable<any> {
    return new Observable(observer => {
      this.http.post<any>(`${this.apiUrl}/api/login`, credentials).subscribe( // Ensure this URL matches your backend endpoint
        response => {
          localStorage.setItem('token', response.token);
          const role = this.getUserRoleFromToken(response.token);
          const userId = this.getUserIdFromToken(response.token);
          const userName = this.getUserNameFromToken(response.token);
          localStorage.setItem('userRole', role);
          localStorage.setItem('userId', userId);
          localStorage.setItem('userName', userName);
          this.currentUserRole.next(role);
          this.isLoggedInApp.next(true);
          observer.next(response);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }
  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/register`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  logout(): Observable<boolean> {
    localStorage.clear();
    this.currentUserRole.next(null);
    this.isLoggedInApp.next(false);
    return of(true);
  }
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }
  setUserRole(role: string): void {
    localStorage.setItem('userRole', role);
  }
  getUserRoleFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      return role || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
  getUserIdFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      return userId || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
  getUserNameFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      return userId || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
  getCurrentUserRole(): Observable<string | null> {
    return this.currentUserRole.asObservable();
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'Admin';
  }
  isUser(): boolean {
    const role = this.getUserRole();
    return role === 'User';
  }
}
 
 
 
 