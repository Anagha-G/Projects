import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userRole: string = null;

  constructor(public authService:AuthService,private router:Router ) { }
  // logout(): void {
  //   this.authService.logout();
  //   this.router.navigate(['/login']);
  // }
  

  ngOnInit(): void {
    
  }
 
  

}
