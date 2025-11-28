import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { PlanApplication } from 'src/app/models/planapplication.model';
import { SavingsPlan } from 'src/app/models/savingsplan.model';
import { PlanapplicationformService } from 'src/app/services/planapplicationform.service';
import { SavingsplanService } from 'src/app/services/savingsplan.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-userplanapplicationform',
  templateUrl: './userplanapplicationform.component.html',
  styleUrls: ['./userplanapplicationform.component.css']
})
export class UserplanapplicationformComponent implements OnInit {
  id: number = 0;
  planApplicationForm: PlanApplication = {
    AppliedAmount: 0,
    Status: 'Pending',
    ApplicationDate: '',
    Remarks: '',
    ProofDocument: '',
    UserId: 0,
    SavingsPlanId: 0
  };
  savingsPlan: SavingsPlan = {
    SavingsPlanId: 0,
    Name: '',
    GoalAmount: 0,
    TimeFrame: 0,
    RiskLevel: null,
    Description: '',
    Status: ''
  };
  selectedFile: File | null = null;
  minDate: string = '';
  maxGoalAmount: number = 0;
  amountError: string = '';
  fileError: string = '';
  isFormValid: boolean = false;

  constructor(
    private savingsPlanService: SavingsplanService,
    private planApplicationformService: PlanapplicationformService,
    private authService: AuthService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.setMinDate();
  }

  loadData(): void {
    this.id = +this.activateRoute.snapshot.params['id'];
    const currentUser = this.authService.getUser();
    if (currentUser && currentUser.userId) {
      this.planApplicationForm.UserId = currentUser.userId;
    } else {
      console.error('User not found or invalid.');
    }
    this.planApplicationForm.SavingsPlanId = this.id;

    this.savingsPlanService.getSavingsPlanById(this.id).subscribe((res) => {
      this.savingsPlan = res;
      this.maxGoalAmount = res.GoalAmount;
    });
  }

  setMinDate(): void {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    this.minDate = `${year}-${month}-${day}`;
  }

  validateAmount(): void {
    if (this.planApplicationForm.AppliedAmount > this.maxGoalAmount) {
      this.amountError = 'Applied Amount must be less than or equal to the goal amount.';
    } else if (this.planApplicationForm.AppliedAmount <= 0) {
      this.amountError = 'Applied Amount must be greater than 0.';
    } else {
      this.amountError = '';
    }
    this.updateFormValidity();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type.toLowerCase();
      if (['image/jpeg', 'image/png', 'image/jpg'].includes(fileType)) {
        this.convertToBase64(file);
        this.fileError = '';
      } else {
        this.fileError = 'Only .jpg, .jpeg, and .png files are allowed.';
        this.selectedFile = null;
        (event.target as HTMLInputElement).value = '';
      }
    } else {
      this.fileError = 'Proof Document is required.';
    }
    this.updateFormValidity();
  }

  convertToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.planApplicationForm.ProofDocument = reader.result as string;
      this.updateFormValidity(); // Ensure validity is updated after file upload
    };
    reader.onerror = () => {
      this.fileError = 'Error converting file to Base64.';
    };
    reader.readAsDataURL(file);
  }

  updateFormValidity(): void {
    // Ensure all required fields are valid
    this.isFormValid =
      !this.amountError && // No amount error
      !this.fileError && // No file error
      this.planApplicationForm.AppliedAmount > 0 && // Applied amount is valid
      this.planApplicationForm.ApplicationDate && // Application date is valid
      this.planApplicationForm.Remarks.trim() !== '' && // Remarks are not empty
      this.planApplicationForm.ProofDocument !== ''; // Proof document is valid
  }

  onSubmit(form: NgForm): void {
    if (!this.isFormValid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please correct the errors before submitting.',
        confirmButtonColor: '#e74c3c'
      });
      return;
    }
    this.submitApplication();
  }

  submitApplication(): void {
    this.planApplicationformService.addPlanApplication(this.planApplicationForm).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Application Submitted',
          text: 'Your application has been successfully submitted.',
          confirmButtonColor: '#007bff'
        }).then(() => {
          this.router.navigate(['/User/AppliedPlans']);
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'An error occurred while submitting the application.',
          confirmButtonColor: '#e74c3c'
        });
        console.error(error);
      }
    );
  }
}