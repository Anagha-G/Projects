import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Internship } from 'src/app/models/internship.model';
import { InternshipService } from 'src/app/services/internship.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-viewinternship',
  templateUrl: './viewinternship.component.html',
  styleUrls: ['./viewinternship.component.css']
})
export class ViewinternshipComponent implements OnInit {
 internships: Internship[] = [];
 searchTerm: string = '';

 constructor(private internshipService: InternshipService, private router: Router) { }

  ngOnInit(): void {
  this.loadInternships();
  }

  loadInternships(): void {
    Swal.fire({
      title : "Loading All Listed Internships",
      text : "Please wait...",
      allowOutsideClick:false,
      didOpen:()=>{
        Swal.showLoading();
      }
    }
    );
    this.internshipService.getAllInternships().subscribe((data: any[]) => {
      Swal.close();
      this.internships = data;
    });
  }

  search(): void {
    if (this.searchTerm) {
      this.internships = this.internships.filter(internship =>
        internship.CompanyName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        internship.Location.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.loadInternships();
    }
  }

  editInternship(internship: Internship): void {
    this.router.navigate([`/admin/admineditinternship/${internship.InternshipId}`]);
  }

 deleteInternship(id: number): void {
  if (confirm('Are you sure you want to delete this internship?')) {
    this.internshipService.deleteInternship(id).subscribe({
      next: () => {
        console.log('Internship deleted successfully');
        this.loadInternships();
      },
      error: (err) => {
        this.router.navigate(['/error']);
        console.error('Error deleting internship:', err);
      }
    });
  }
 }

}

