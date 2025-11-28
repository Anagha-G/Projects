import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  mobile: string = '';
  role: string = '';
  otp: string = '';
  showOtpModal: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  // Step 1: Generate OTP
  generateOtp(form: NgForm): void {
    if (form.valid) {
      const newUser: User = {
        UserId: 0,
        Email: this.email,
        Password: this.password,
        Username: this.username,
        MobileNumber: this.mobile,
        UserRole: this.role,
      };
  
      this.authService.register(newUser).subscribe({
        next: () => {
          this.showOtpModal = true;
          Swal.fire({
            icon: 'success',
            title: 'OTP Sent',
            text: 'An OTP has been sent to your registered mobile number.',
            confirmButtonColor: '#007bff',
          });
        },
        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error.message || 'Something went wrong. Please try again.',
            confirmButtonColor: '#e74c3c',
          });
        },
      });
    }
  }

  // Step 2: Verify OTP
  verifyOtp(): void {
    const newUser: User = {
      UserId: 0,
      Email: this.email,
      Password: this.password,
      Username: this.username,
      MobileNumber: this.mobile,
      UserRole: this.role,
    };
  
    this.authService.verifyRegistrationOtp(newUser, this.otp).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Your registration is now complete!',
          confirmButtonColor: '#007bff',
        }).then(() => {
          this.router.navigate(['/Login']);
        });
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Invalid OTP',
          text: error.message || 'The OTP you entered is incorrect. Please try again.',
          confirmButtonColor: '#e74c3c',
        });
      },
    });
  }

  resendOtp(): void {
    this.generateOtp({ valid: true } as NgForm);
    Swal.fire({
      icon: 'info',
      title: 'OTP Resent',
      text: 'A new OTP has been sent to your registered email address.',
      confirmButtonColor: '#007bff',
    });
  }

  // Close OTP Modal
  closeOtpModal(): void {
    this.showOtpModal = false; // Set the modal visibility to false
    this.otp = ''; // Optionally clear the OTP input field
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
}