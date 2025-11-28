import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Feedback } from 'src/app/models/feedback.model';
import { AuthService } from 'src/app/services/auth.service';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-useraddfeedback',
  templateUrl: './useraddfeedback.component.html',
  styleUrls: ['./useraddfeedback.component.css']
})
export class UseraddfeedbackComponent implements OnInit {
  feedback: Feedback = {
    UserId: 0,
    Comments: '',
    DateProvided: new Date()
  };
  CurrentUser: any;
  showPopup: boolean = false;
  isSubmitting: boolean = false; // Prevent multiple submissions

  constructor(
    private router: Router,
    private feedbackService: FeedbackService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Initialize UserId from AuthService
    this.CurrentUser = this.authService.getUser();
    this.feedback.UserId = Number(this.CurrentUser.userId);
  }

  /**
   * Handles form submission to send feedback.
   */
  onSubmit(feedbackForm: any): void {
    if (!this.feedback.Comments) {
      feedbackForm.form.markAllAsTouched(); // Display validation messages
      return;
    }

    if (this.isSubmitting) {
      return; // Prevent multiple submissions
    }

    this.isSubmitting = true; // Lock submission
    console.log('Submitting feedback:', this.feedback);

    this.feedbackService.sendFeedback(this.feedback).subscribe({
      next: () => {
        console.log('Feedback submitted successfully:', this.feedback);
        this.showPopup = true; // Show confirmation popup
        this.isSubmitting = false; // Unlock submission
      },
      error: (error) => {
        console.error('Error submitting feedback:', error);
        this.isSubmitting = false; // Unlock submission
      }
    });
  }

  /**
   * Closes the popup and resets the form.
   */
  closePopup(): void {
    const modalElement = document.querySelector('.popup');
    if (modalElement) {
      modalElement.classList.add('fade-out'); // Add fade-out animation
      setTimeout(() => {
        this.showPopup = false; // Hide popup after animation
        // Reset feedback form
        this.feedback = {
          UserId: Number(this.CurrentUser.userId),
          Comments: '',
          DateProvided: new Date()
        };
        this.router.navigate(['/User/Feedbacks']); // Navigate to AddFeedback
      }, 400); // Match fade-out animation duration
    }
  }
}