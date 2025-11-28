import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Feedback } from 'src/app/models/feedback.model';
import { AuthService } from 'src/app/services/auth.service';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-managerviewfeedback',
  templateUrl: './managerviewfeedback.component.html',
  styleUrls: ['./managerviewfeedback.component.css']
})
export class ManagerviewfeedbackComponent implements OnInit {
  feedbacks: Feedback[] = [];
  showDetailsPopup: boolean = false; 
  selectedUserDetails: { Username?: string; Email?: string; MobileNumber?: string } = {};
  isLoading: boolean = true; 

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 5;

  // Property to track whether data has been fetched
  dataFetched: boolean = false;

  constructor(private feedbackService: FeedbackService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  // Load feedbacks and populate user details
  loadFeedbacks(): void {
    this.feedbackService.getFeedbacks().subscribe((feedbacks: Feedback[]) => {
      if (feedbacks.length === 0) {
        // No feedback records found
        this.dataFetched = true; // Mark data as fetched
        return;
      }

      // Fetch user details for each feedback
      const userRequests = feedbacks.map((feedback) =>
        this.authService.getUserById(feedback.UserId)
      );

      forkJoin(userRequests).subscribe((users) => {
        feedbacks.forEach((feedback, index) => {
          feedback.User = users[index]; // Map user details to feedback
        });

        this.feedbacks = feedbacks;
        this.dataFetched = true; 
        this.isLoading = false;
      });
    }, (error) => {
      // Handle error case
      console.error('Error fetching feedbacks:', error);
      this.dataFetched = true; 
      this.isLoading = false;
    });
  }

  // Show details popup for the selected feedback
  showDetails(feedback: Feedback): void {
    if (feedback.User) {
      this.selectedUserDetails = {
        Username: feedback.User.Username,
        Email: feedback.User.Email,
        MobileNumber: feedback.User.MobileNumber
      };
      this.showDetailsPopup = true;
    }
  }

  // Close the details popup
  closeDetailsPopup(): void {
    this.showDetailsPopup = false; 
    this.selectedUserDetails = {}; 
  }

  // Pagination methods
  public get paginatedFeedbacks(): Feedback[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.feedbacks.slice(startIndex, startIndex + this.itemsPerPage);
  }

  public changePage(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  public totalPages(): number {
    return Math.ceil(this.feedbacks.length / this.itemsPerPage);
  }
}