import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Internship } from 'src/app/models/internship.model';
import { InternshipApplication } from 'src/app/models/internshipapplication.model';
import { InternshipService } from 'src/app/services/internship.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-userviewinternship',
  templateUrl: './userviewinternship.component.html',
  styleUrls: ['./userviewinternship.component.css']
})
export class UserviewinternshipComponent implements OnInit {

  internships: Internship[] = [];
  paginatedInternships: Internship[] = [];
  appliedInternships: Set<number> = new Set();
  itemsPerPage = 6;
  currentPage = 1;
  errorMessage = '';
  isLoading = true;

  constructor(
    private internshipservice: InternshipService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.allInternships();
    this.allApplications();
  }

  

  allApplications(): void {
    const userId = Number(localStorage.getItem('userId'));
    this.internshipservice.getAppliedInternships(userId).subscribe(
      (res) => {
        this.appliedInternships = new Set(res.map(app => app.InternshipId));
      },
      (error) => {
        console.error('Error fetching applications:', error);
      }
    );
  }

  allInternships(): void {
    Swal.fire({
      title : "Loading Internships..",
      text : "Please wait",
      allowOutsideClick:false,
      didOpen:()=>{
        Swal.showLoading();
      }
    }
    );
    this.isLoading = true;
    this.internshipservice.getAllInternships().subscribe(
      (data: Internship[]) => {
        this.internships = data;
        this.paginateInternships();
        this.isLoading = false;
        Swal.close();
      },
      (error) => {
        console.error('Error fetching internships:', error);
        this.errorMessage = 'Failed to load internships.';
        this.isLoading = false;
        Swal.close();
      }
    );
  }

  paginateInternships(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedInternships = this.internships.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateInternships();
    }
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.internships.length) {
      this.currentPage++;
      this.paginateInternships();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.internships.length / this.itemsPerPage);
  }

  applyInternship(id: number): void {
    this.appliedInternships.add(id);
    this.router.navigate([`/user/internshipform/${id}`]);
  }

  isApplied(id: number): boolean {
    return this.appliedInternships.has(id);
  }
  
}
