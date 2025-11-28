import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { InternshipApplication } from 'src/app/models/internshipapplication.model';
import { ActivatedRoute, Router } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';

@Component({
  selector: 'app-internshipform',
  templateUrl: './internshipform.component.html',
  styleUrls: ['./internshipform.component.css']
})
export class InternshipformComponent implements OnInit {
  private intershipId: number;
  application: InternshipApplication = {
    UserId: 0,
    InternshipId: 0,
    UniversityName: '',
    DegreeProgram: '',
    Resume: '',
    ApplicationStatus: 'Pending',
    ApplicationDate: new Date()
  };

  constructor(private route: ActivatedRoute, private ser: InternshipService, private router: Router) {
    this.route.params.subscribe(
      (params) => {
        this.intershipId = + params[`id`];
        console.log(this.intershipId);
      }
    )
  }
  onFileChange(event: any): void {
    const file = event.target.files[0];
  
    if (file) {
      const maxSizeKB = 100;
      if (file.size > maxSizeKB * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File too large',
          text: 'File size must be under 100KB',
          confirmButtonText: 'OK'
        });
        return;
      }
  
      const reader = new FileReader();
  
      reader.onload = () => {
        this.application.Resume = reader.result as string;  // base64 data URL
      };
  
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
  
      reader.readAsDataURL(file); // this supports pdf, image, txt etc.
    }
  }
  
  

  onSubmit(): void {
    if (this.application.UniversityName && this.application.DegreeProgram && this.application.Resume && this.intershipId && this.intershipId != 0) {
      //console.log('Form submitted', this.application);
      Swal.fire({
        title: 'Submitting Application',
        text: 'Please wait while we submit the application...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      this.application.UserId = Number(localStorage.getItem('userId'));
      this.application.InternshipId = this.intershipId;
      this.ser.addInternshipApplication(this.application).subscribe(
        (data) => {
          Swal.close();
          Swal.fire({
            title: 'Successfully Submitted!',
            text: 'Your application has been submitted successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/user/userappliedinternships']);
            }
          });
        },
        (error) => {
          console.error('Error fetching internships', error);
        }
      );



    }
  }

  goBack(): void {
    this.router.navigate(['/user/userviewinternship']);
  }


  ngOnInit(): void {
    this.route.params.subscribe(
      (params) => {
        this.intershipId = + params[`id`];
        console.log(this.intershipId);
      }
    )
  }

}

