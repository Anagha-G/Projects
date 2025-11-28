import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Login } from '../models/login.model';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public baseUrl = environment.apiUrl;

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  private roleSubject = new BehaviorSubject<string>('navbar'); // Default to 'navbar'
  public role$: Observable<string> = this.roleSubject.asObservable();

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
    this.updateRole(); // Initialize role on load
  }

  // User Authentication Methods

  // Register user (Step 1: Generate OTP)
  register(newUser: User): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, newUser).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, 'An unexpected error occurred.'))
    );
  }

  // Verify Registration OTP (Step 2: Verify OTP and complete registration)
  verifyRegistrationOtp(newUser: User, otp: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/verify-registration-otp?otp=${otp}`, newUser).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, 'Invalid OTP.'))
    );
  }

  // Login user (Step 1: Generate OTP)
  login(loginUser: Login): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, loginUser).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, 'Invalid login credentials.'))
    );
  }

  // Verify Login OTP (Step 2: Verify OTP and complete login)
  verifyLoginOtp(loginUser: Login, otp: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/verify-login-otp?otp=${otp}`, loginUser).pipe(
      tap((response) => this.handleLoginSuccess(response)),
      catchError((error: HttpErrorResponse) => this.handleError(error, 'Invalid OTP.'))
    );
  }

  // Forgot Password: Send OTP
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/forgot-password?email=${email}`, email).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, 'Failed to send OTP.'))
    );
  }

  // Verify OTP and Reset Password
  verifyOtpResetPassword(resetModel: Login, otp: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/verify-reset-otp?otp=${otp}`, resetModel).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, 'Failed to reset password.'))
    );
  }

  // User Management Methods

  // Get user by ID
  getUserById(userId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
    });

    return this.http.get<any>(`${this.baseUrl}/Users/${userId}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, 'An error occurred while fetching user data.'))
    );
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      return false;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(new Date().getTime() / 1000);
    return payload.exp > currentTime;
  }

  // Get user details
  getUser(): any {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      return null;
    }
    const decodedToken: any = jwtDecode(token);
    return {
      userId: decodedToken.userId,
      username: decodedToken.userName,
      role: decodedToken.role,
      email: decodedToken.email
    };
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('jwtToken');
    this.currentUserSubject.next(null);
    this.roleSubject.next('navbar'); // Reset role to default
  }

  // Role Management Methods

  // Update the current role
  private updateRole(): void {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      this.roleSubject.next('navbar'); // Default to 'navbar' when no token exists
      return;
    }
    const decodedToken: any = jwtDecode(token);
    const role = decodedToken.role || 'navbar';
    this.roleSubject.next(role); // Emit the current role
  }

  // Helper Methods

  // Handle login success
  private handleLoginSuccess(response: any): void {
    const token = response.message;
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user = {
        userId: payload.userId,
        userName: payload.userName,
        email: payload.email,
        role: payload.role,
      };
      localStorage.setItem('jwtToken', token);
      this.currentUserSubject.next(user);
      this.updateRole(); // Update role after login
    }
  }

  // Handle errors
  private handleError(error: HttpErrorResponse, defaultMessage: string): Observable<never> {
    const backendMessage = error.error || error.message || defaultMessage;
    return throwError(() => new Error(backendMessage));
  }
}