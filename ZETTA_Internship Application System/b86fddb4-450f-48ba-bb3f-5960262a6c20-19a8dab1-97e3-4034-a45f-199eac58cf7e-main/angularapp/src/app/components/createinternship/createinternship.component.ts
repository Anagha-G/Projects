 import { Component, OnInit } from '@angular/core';
 import { Internship } from 'src/app/models/internship.model';
 import { ActivatedRoute, Router } from '@angular/router';
 import { FormsModule,NgForm,ReactiveFormsModule } from '@angular/forms';
 import { InternshipService } from 'src/app/services/internship.service';

 import Swal from 'sweetalert2';
 @Component({
   selector: 'app-createinternship',
   templateUrl: './createinternship.component.html',
  styleUrls: ['./createinternship.component.css']
})

export class CreateinternshipComponent implements OnInit {  
 internship:Internship=
   {
     Title:'',
     CompanyName:'',
     Location:'',
     DurationInMonths:0,
     Stipend:0,
     Description:'',
     SkillsRequired:'',
     ApplicationDeadline:''
   };
  formSubmitted:boolean=false;
  internshipId:number;
  currentDate:string;

message: string = '';
isLoggedIn: boolean = false;
showModal: boolean = false;
showModalOnce: boolean = false;
constructor(private route:ActivatedRoute,private internshipService:InternshipService,private router:Router) { }
  
  
 ngOnInit(): void {
   this.checkLoginStatus();
   const today = new Date();
   const year = today.getFullYear();
   const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero
   const day = today.getDate().toString().padStart(2, '0'); // Add leading zero
   this.currentDate = `${year}-${month}-${day}`;
}
 checkLoginStatus(): void {
   const token = localStorage.getItem('token');
   if (token) {
     this.isLoggedIn = true;
   } else {
     this.isLoggedIn = false;
     this.showErrorMessage('Please log in to add an Internship.');
    this.router.navigate (['/login']);
   }
 }
   

addInternship(form:NgForm)
{
  if (!this.isLoggedIn) {
    this.showErrorMessage('Please log in first');
    return;
  }
  if (form.invalid || !this.customValidation()) {
    return;
  }

  Swal.fire({
    title : "Adding Internship",
    text : "Please wait...",
    allowOutsideClick:false,
    didOpen:()=>{
      Swal.showLoading();
    }
  }
  );

  this.internshipService.addInternship(this.internship).subscribe({
    next: () => {
      this.router.navigate(['/admin/viewinternship']);
      //this.showSuccessMessage('Internship added successfully');
      this.showModal = true; // Show the modal on success
    },
    error: (error) => {
      console.error('Error adding internship:', error.error);
      if (error.error && error.error.includes('Failed to add internship')) {
        this.showErrorMessage('An Internship with this name already exists. Please choose a different name.');
      } else {
        this.showErrorMessage('Error adding Internship');
      }
      this.showModal = true; // Show the modal on error
    }
  });
}
customValidation(): boolean {
  const { Title, CompanyName, Location, DurationInMonths, Stipend, Description, SkillsRequired, ApplicationDeadline } = this.internship;
  if (Title.length > 50) {
    this.showErrorMessage('Title must be less than 50 characters');
    return false;
  }
  if (CompanyName.length > 30) {
    this.showErrorMessage('Company Name must be less than 30 characters');
    return false;
  }
  if (Location.length > 50) {
    this.showErrorMessage('Location must be less than 50 characters');
    return false;
  }
 
   if (Stipend < 0) {
     this.showErrorMessage('Stipend must be a positive number');
     return false;
   }
   if (Description.length > 200) {
     this.showErrorMessage('Description must be less than 200 characters');
     return false;
   }
   if (SkillsRequired.length > 30) {
     this.showErrorMessage('Skills Required must be less than 30 characters');
     return false;
   }
    if (ApplicationDeadline.length > 200) {
      this.showErrorMessage('Special Requirements must be less than 200 characters');
      return false;
    }
   return true;
 }

 validateField(form: NgForm, fieldName: string) {
   const control = form.controls[fieldName];
   if (control && control.errors) {
     control.markAsDirty();
   }
 }
 closeModal() {
   this.showModal = false;  // Close the modal
   this.showModalOnce = false;  //Reset the flag
 }
 showErrorMessage(message: string): void {
   this.message = message;
   Swal.fire({
     title: 'Error!',
     text: message,
     confirmButtonText: 'OK'
   });
 }
 showSuccessMessage(message: string): void {
   this.message = message;
   Swal.fire({
     title: 'Success!',
     text: message,
     confirmButtonText: 'OK'
   });
 }
}


