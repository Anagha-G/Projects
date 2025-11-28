import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-usernav',
  templateUrl: './usernav.component.html',
  styleUrls: ['./usernav.component.css']
})
export class UsernavComponent implements OnInit {
  getUser: any;
  user: any;
  showUserDetails = false;
  showLogoutPopup = false;


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.getUser = this.authService.getUser();
    this.authService.getUserById(this.getUser.userId).subscribe(data => {
      this.user = data;
    });
  }

  toggleUserDetails(): void {
    this.showUserDetails = !this.showUserDetails;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/Login']);
  }

  confirmLogout(): void {
    this.showLogoutPopup = true; // Show the confirmation popup
  }

  cancelLogout(): void {
    this.showLogoutPopup = false; // Hide the confirmation popup
  }

}