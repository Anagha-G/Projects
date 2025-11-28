import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Login } from 'src/app/models/login.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showOtpModal: boolean = false; // OTP Modal visibility
  showForgotPasswordModal: boolean = false; // Forgot Password Modal visibility
  showResetPasswordModal: boolean = false; // Reset Password Modal visibility
  currentUser: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.logout();
  }

  generateOtp(form: NgForm): void {
    if (!form.valid) {
      this.showPopup('error', 'Validation Error', 'Please fill all the required fields with valid data.');
      return;
    }
  
    const loginUser: Login = {
      Email: this.email,
      Password: this.password,
    };
  
    this.authService.login(loginUser).subscribe({
      next: () => {
        this.showOtpModal = true; // Show OTP modal
        this.showPopup('success', 'OTP Sent', 'An OTP has been sent to your registered email address.');
      },
      error: (error: any) => {
        const errorMessage =
          error.error?.message || error.message || 'An unknown error occurred';
  
        if (errorMessage === 'Invalid Email.') {
          this.email = '';
          this.password = '';
          this.showPopup('error', 'Invalid Email', 'The email address you entered is not valid.');
        } else if (errorMessage === 'Invalid Password.') {
          this.password = '';
          this.showPopup('error', 'Invalid Password', 'The password you entered is incorrect.');
        } else {
          console.error('Login failed', error);
          this.showPopup('error', 'Login Failed', 'An error occurred during login. Please try again later.');
        }
      },
    });
  }


  // Step 2: Verify OTP

  verifyOtp(): void {
    const loginUser: Login = {
      Email: this.email,
      Password: this.password,
    };
  
    this.authService.verifyLoginOtp(loginUser, this.otp).subscribe({
      next: () => {
        this.currentUser = this.authService.getUser();
        console.log(this.currentUser);
        this.showPopup('success', 'Login Successful', 'You have successfully logged in.');
  
        // Redirect user based on role
        if (this.currentUser.role == 'RegionalManager') {
          this.router.navigate(['/Manager/Dashboard']);
        } else if (this.currentUser.role == 'Customer') {
          this.router.navigate(['/User/Home']);
        }
      },
      error: (error: any) => {
        this.showPopup('error', 'Invalid OTP', error.error?.message || 'The OTP you entered is incorrect. Please try again.');
      },
    });
  }


  // Resend OTP
  resendOtp(): void {
    const loginUser: Login = {
      Email: this.email,
      Password: this.password,
    };
  
    this.authService.login(loginUser).subscribe({
      next: () => {
        this.showPopup('info', 'OTP Resent', 'A new OTP has been sent to your email address.');
      },
      error: (error: any) => {
        this.showPopup('error', 'Error Resending OTP', error.error?.message || 'Failed to resend the OTP. Please try again.');
      },
    });
  }

  // Close OTP Modal
  closeOtpModal(): void {
    this.showOtpModal = false; // Hide OTP modal
    this.otp = ''; // Clear OTP input field
  }

  // Open Forgot Password Modal
  openForgotPassword(): void {
    this.showForgotPasswordModal = true;
  }

  // Step 1 for Forgot Password: Send OTP
  sendForgotPasswordOtp(): void {
    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.showPopup('info', 'OTP Resent', 'A new OTP has been sent to your email address.');
        this.showForgotPasswordModal = false;
        this.showResetPasswordModal = true;
      },
      error: (error: any) => {
        this.showPopup('error', 'Error Resending OTP', error.error?.message || 'Failed to resend the OTP. Please try again.');
      },
    });
  }

  // Step 2 for Forgot Password: Reset Password
  resetPassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.showPopup('error', 'Passwords Do Not Match', 'Please make sure both password fields match.');

      return;
    }

    var resetModel: Login = {
      Email: this.email,
      Password: this.newPassword,
    };

    this.authService.verifyOtpResetPassword(resetModel, this.otp).subscribe({
      next: () => {
        this.password = '';
        resetModel = null;
        this.otp = null;
        this.newPassword = '';
        this.showPopup('success', 'Password Reset Successful', 'Your password has been reset successfully.');
        this.showResetPasswordModal = false;
      },
      error: (error: any) => {
        this.showPopup('error', 'Error Resetting Password', error.error?.message || 'Failed to reset password.');
      },
    });
  }
// Close Forgot Password Modal
closeForgotPasswordModal(): void {
  this.showForgotPasswordModal = false; // Hide Forgot Password modal
  this.email = ''; // Clear email input field
}
// Close Reset Password Modal
closeResetPasswordModal(): void {
  this.showResetPasswordModal = false; // Hide Reset Password modal
  this.otp = ''; // Clear OTP input field
  this.newPassword = ''; // Clear new password field
  this.confirmPassword = ''; // Clear confirm password field
}
  // Navigation to Register Page
  navigateToRegister(): void {
    this.router.navigate(['/Register']);
  }

  // Password validations
  checkLowercase(): boolean {
    return /[a-z]/.test(this.password);
  }

  checkUppercase(): boolean {
    return /[A-Z]/.test(this.password);
  }

  checkDigit(): boolean {
    return /\d/.test(this.password);
  }

  checkSpecialChar(): boolean {
    return /[!@#$%^&*]/.test(this.password);
  }

  checkMinLength(): boolean {
    return this.password.length >= 8;
  }

  checkpassword(): boolean {
    return this.password !== this.confirmPassword;
  }

  showPopup(category: 'success' | 'error' | 'info', title: string, text: string): void {
    let icon: 'success' | 'error' | 'info';
  
    // Assign the correct icon based on the category
    switch (category) {
      case 'success':
        icon = 'success';
        break;
      case 'error':
        icon = 'error';
        break;
      case 'info':
        icon = 'info';
        break;
      default:
        icon = 'info'; // Default fallback
    }
  
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      confirmButtonColor: category === 'success' ? '#007bff' : category === 'error' ? '#e74c3c' : '#ffc107',
    });
  }
}