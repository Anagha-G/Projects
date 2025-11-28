import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Feedback } from 'src/app/models/feedback.model';
import { AuthService } from 'src/app/services/auth.service';
import { FeedbackService } from 'src/app/services/feedback.service';
 
@Component({
  selector: 'app-userviewfeedback',
  templateUrl: './userviewfeedback.component.html',
  styleUrls: ['./userviewfeedback.component.css']
})
export class UserviewfeedbackComponent implements OnInit {
  feedbacks: Feedback[] = [];
  userId: string;
  delPopup: boolean = false;
  feedbackToDel: Feedback | null = null;
  currentUser: any = null;
  isLoading: boolean = true;
 
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 5;
 
  constructor(private router: Router, private service: FeedbackService, private authService: AuthService) { }
 
  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.userId = String(this.currentUser.userId);
    this.getFeedbacksByUserId(this.userId);
  }
 
  public confirmDelete(feedback: Feedback): void {
    console.log("Feedback to delete:", feedback);
    this.feedbackToDel = feedback;
    this.delPopup = true;
  }
 
  public deleteFeedback(): void {
    if (this.feedbackToDel) {
      this.service.deleteFeedback(String(this.feedbackToDel.FeedbackId)).subscribe(() => {
        this.getFeedbacksByUserId(this.userId);
        this.delPopup = false;
        this.feedbackToDel = null;
      });
    }
  }
 
  public getFeedbacksByUserId(userId: string): void {
    this.service.getAllFeedbacksByUserId(userId).subscribe((data: Feedback[]) => {
      this.feedbacks = data;
      this.isLoading = false;
    });
  }
 
  public closeDel(): void {
    this.delPopup = false;
    this.feedbackToDel = null;
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