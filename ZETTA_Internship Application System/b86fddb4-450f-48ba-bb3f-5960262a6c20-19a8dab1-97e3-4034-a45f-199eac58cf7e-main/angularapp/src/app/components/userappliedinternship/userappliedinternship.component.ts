import { Component, OnInit } from '@angular/core';
import { InternshipApplication } from 'src/app/models/internshipapplication.model';
import { InternshipService } from 'src/app/services/internship.service';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-userappliedinternship',
  templateUrl: './userappliedinternship.component.html',
  styleUrls: ['./userappliedinternship.component.css']
})



export class UserappliedinternshipComponent implements OnInit {
  appliedInternships: InternshipApplication[] = [];
  filteredInternships: InternshipApplication[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  internshipsPerPage: number = 10;
  selectedResumeUrl: string | null = null;
  token = localStorage.getItem('token');
  userIdString = this.authService.getUserIdFromToken(this.token);
  userId = Number(this.userIdString);
  

  fileContent: string | null = null;
  fileType: string | null = null;

  constructor(
    private internshipService: InternshipService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.token) {
      this.loadAppliedInternships(this.userId);
    } else {
      console.error('Token not found in local storage');
    }
  }
  loadAppliedInternships(userId: number): void {
    Swal.fire({
      title : "Loading Applications..",
      text : "Please wait",
      allowOutsideClick:false,
      didOpen:()=>{
        Swal.showLoading();
      }
    }
    );
    this.internshipService.getAppliedInternships(userId).subscribe(
      (applications: InternshipApplication[]) => {
        console.log(applications);
        this.appliedInternships = applications;

        this.filteredInternships = [...this.appliedInternships];
        Swal.close();
      },
      (error) => {
        console.error('Error fetching internships:', error);
        Swal.close();
      }
    );
  }



  searchInternships(): void {
    this.currentPage = 1;
    this.updateFilteredInternships();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updateFilteredInternships();
  }

  updateFilteredInternships(): void {
    let filtered = this.appliedInternships;
    if (this.searchQuery) {
      filtered = filtered.filter(item => {
        return item.Internship.CompanyName.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
    const startIndex = (this.currentPage - 1) * this.internshipsPerPage;
    const endIndex = startIndex + this.internshipsPerPage;
    this.filteredInternships = filtered.slice(startIndex, endIndex);
  }

  confirmDelete(internshipId: number): void {
    Swal.fire({
      title: 'Are you sure you want to delete this application?',
      showCancelButton: true, // Enables the "No" button
      confirmButtonText: 'Yes', // Text for the "Yes" button
      cancelButtonText: 'No',  // Text for the "No" button
      icon: 'warning', // Optional: Adds a warning icon to the dialog
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked "Yes"
        console.log('Application deleted!');
        this.deleteInternship(internshipId);
        // Add your delete logic here
      } else if (result.isDismissed) {
        // User clicked "No" or dismissed the dialog
        console.log('Application not deleted.');
       
      }
    });
  }

  deleteInternship(internshipId: number): void {
    this.internshipService.deleteInternshipApplication(internshipId).subscribe(
      () => {
        this.ngOnInit();
      },
      (error) => console.error('Error deleting internship:', error)
    );
  }
  

  getTotalPages(): number {
    return Math.ceil(this.appliedInternships.length / this.internshipsPerPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredInternships();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updateFilteredInternships();
    }
  }

  openResume(resumeBase64: string) {
    this.selectedResumeUrl = resumeBase64;
    this.fileContent = atob(resumeBase64.split(',')[1]);
    
  }
  

  closeResume() {
    console.log('closeResume function called');
    this.selectedResumeUrl = null;
  }




}