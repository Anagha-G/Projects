import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adminviewfeedback',
  templateUrl: './adminviewfeedback.component.html',
  styleUrls: ['./adminviewfeedback.component.css']
})
export class AdminviewfeedbackComponent implements OnInit {
  feedbacks: Feedback[] = [];
  selectedFeedback: Feedback | null = null;
  showProfileModal: boolean = false;
  showLogoutModal: boolean = false;
  errorMessage: string = '';
  Username: string = '';
  //Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private feedbackService: FeedbackService, private router: Router) { }

  ngOnInit(): void {
    this.loadFeedbacks();
    this.Username = localStorage.getItem('userName') || '';
  }

  loadFeedbacks(): void {
    Swal.fire({
      title: "Loading Feedbacks",
      text: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    }
    );
    this.feedbackService.getFeedbacks().subscribe(
      (data) => {
        console.log(data);
        //console.log('Loading feedbacks...');
        Swal.close();
        this.feedbacks = data;
        if (this.feedbacks.length === 0) {
          this.errorMessage = 'No data found';
        }
      },
      (error) => {
        Swal.close();
        console.error('Error fetching feedbacks:', error);
        this.errorMessage = 'Failed to load feedbacks.';
      }
    );
  }

  showProfile(feedback: Feedback): void {
    this.selectedFeedback = feedback;
    this.showProfileModal = true;
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
    this.selectedFeedback = null;
  }

  confirmLogout(): void {
    this.showLogoutModal = true;
  }

  closeLogoutModal(): void {
    this.showLogoutModal = false;
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  //Pagination methods
  get paginatedFeedbacks(): Feedback[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.feedbacks.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.feedbacks.length) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.feedbacks.length / this.itemsPerPage);
  }

}



