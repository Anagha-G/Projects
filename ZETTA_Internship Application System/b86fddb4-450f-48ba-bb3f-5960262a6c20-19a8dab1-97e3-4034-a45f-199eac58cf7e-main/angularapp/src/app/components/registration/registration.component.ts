import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';// Import SweetAlert2

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
   registrationForm: FormGroup; // Define FormGroup
  passwordFieldType: string = 'password'; 
  confirmPasswordFieldType: string = 'password';
  adminCode: string = 'AD2025';

  constructor(
    private fb: FormBuilder, //Inject FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern('^[a-zA-Z][a-zA-Z\\s]*$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]+$')]],
      confirmPassword: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      userRole: ['', Validators.required],
      secretKey: ['']
    }, { validator: this.passwordMatchValidator });
   }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password').value === form.get('confirmPassword').value ? null : { mismatch: true };
  }

  onRegister() {
    if (this.registrationForm.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Please correct the errors in the form.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (this.registrationForm.get('userRole').value === 'Admin' && this.registrationForm.get('secretKey').value !== this.adminCode) {
      Swal.fire({
        title: 'Error!',
        text: 'Invalid secret key!',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    Swal.fire({
      title : "Registering You",
      text : "Please wait...",
      allowOutsideClick:false,
      didOpen:()=>{
        Swal.showLoading();
      }
    }
    );

    this.completeRegistration();
  }

  completeRegistration() {
    const registrationData = this.registrationForm.value;

    console.log('Registration Data:', JSON.stringify(registrationData, null, 2)); //Detailed log
    console.log('Role Value:', this.registrationForm.get('userRole').value);

    this.authService.register(registrationData).subscribe({
      next: (response) => {
        Swal.close();
        //console.log('Registration successful:', response);
        Swal.fire({
          title: 'Registration Successful',
          text: 'You have successfully registered!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        console.error('Registration failed', err);
        if (err.error && err.error.errors) {
          console.log('Validation Errors:', err.error.errors);
          Swal.fire({
            title: 'Error!',
            text: `Registration failed: ${JSON.stringify(err.error.errors)}`,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Registration failed. Please check your input and try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    });
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    } else if (field === 'confirmPassword') {
      this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
  }
}