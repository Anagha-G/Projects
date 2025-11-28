import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,private router:Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

     console.log('AuthGuard invoked');

    //Check if user is logged in and token is valid
    if (!this.authService.isLoggedIn() || !this.authService.isTokenValid()) {
      console.log('User not logged in or token invalid, redirecting to login');
      this.router.navigate(['/login'], {
        queryParams: { message: 'Session expired or not logged in' }
      });
      return false;
    }

     const userRole = this.authService.getUserRole();
     const targetUrl = state.url;
     console.log(`User role: ${userRole}, Target URL: ${targetUrl}`);

    if (
      (userRole === 'Admin' && targetUrl.includes('/user')) ||
      (userRole === 'User' && targetUrl.includes('/admin'))
    ) {
      console.log('Role does not match target URL, redirecting to error');
      this.router.navigate(['/error'], {
        queryParams: { message: 'Access Denied: Insufficient permissions' }
      });
      return false;
    }

     console.log('Access granted');
    return true;
  }
}
