import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-userviewfeedback',
  templateUrl: './userviewfeedback.component.html',
  styleUrls: ['./userviewfeedback.component.css']
})
export class UserviewfeedbackComponent implements OnInit {
 
  feedbacks: Feedback[] = [];
  selectedFeedback: Feedback | null = null;
  showDeleteModal: boolean = false;
  showProfileModal:boolean=false;
  showLogoutModal: boolean = false;
  errorMessage: string = '';

  constructor(private feedbackService: FeedbackService, private router: Router) {}
 
  ngOnInit(): void {
     this.loadFeedbacks();
  }
 
  loadFeedbacks(): void {
    const userId = parseInt(localStorage.getItem('userId'));
    if (userId) {
      Swal.fire({
        title : "Loading Feedbacks..",
        text : "Please wait",
        allowOutsideClick:false,
        didOpen:()=>{
          Swal.showLoading();
        }
      }
      );
      this.feedbackService. getFeedbacksByUserId(userId).subscribe(
        (data) => {
          Swal.close();
          this.feedbacks = data;
          console.log(data);
        },
        (error) => {
          console.error('Error fetching feedbacks:', error);
          this.errorMessage = 'No Feedbacks Found.';
        }
      );
    }
  }
  
 
  showProfile(feedback: Feedback): void {
    this.selectedFeedback = feedback;
    this.showProfileModal = true;
  }
 
  closeProfileModal(): void {
    this.showProfileModal = false;
  }
 
  confirmDelete(feedback: Feedback): void {
    this.selectedFeedback = feedback;
    this.showDeleteModal = true;
  }
 
  deleteFeedback(): void {
    if (this.selectedFeedback) {
      this.feedbackService.deleteFeedback(this.selectedFeedback.FeedbackId!).subscribe(
        () => {
          this.showDeleteModal = false;
          this.loadFeedbacks(); 
          Swal.fire({
            title: 'Feedback Deleted',
            text: 'The feedback has been successfully deleted!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.router.navigate(['/user/userviewfeedback']);
        },
        (error) => {
          console.error('Error deleting feedback:', error);
          this.errorMessage = 'Failed to delete feedback.';
        }
      );
    }
  }
 
  logout(): void {
    this.showLogoutModal = true;
  }
 
 
 
}
 
 