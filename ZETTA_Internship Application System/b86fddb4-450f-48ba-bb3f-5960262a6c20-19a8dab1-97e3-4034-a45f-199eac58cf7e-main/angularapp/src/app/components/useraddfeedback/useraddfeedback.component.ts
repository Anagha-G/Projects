import { Component, OnInit } from '@angular/core';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-useraddfeedback',
  templateUrl: './useraddfeedback.component.html',
  styleUrls: ['./useraddfeedback.component.css']
})
export class UseraddfeedbackComponent implements OnInit {
  feedback: Feedback = {
    UserId: 0,
    FeedbackText: '',
    Date: new Date()
  };
  feedbackRequired: boolean = false;
 
  constructor(
    private feedbackService: FeedbackService,
    private authService: AuthService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    const userId = localStorage.getItem("userId");
    if (userId) {
      this.feedback.UserId =+ userId;
    }
  }
 
  onSubmit(feedbackForm: any): void {
    if (!this.feedback.FeedbackText) {
      feedbackForm.form.markAllAsTouched();// Mark all fields as touched to show validation messages
      this.feedbackRequired = true;
     
      return;
    }
 
    this.feedbackRequired = false;
    Swal.fire({
      title : "Submitting Feedback..",
      text : "Please wait",
      allowOutsideClick:false,
      didOpen:()=>{
        Swal.showLoading();
      }
    }
    );
    //console.log(this.feedback);
    this.feedbackService.addFeedback(this.feedback).subscribe(() => {
      console.log("clicking submit");
      Swal.close();
      Swal.fire({
        title: 'Successfully Added!',
        text: 'Your feedback has been submitted successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {

        this.router.navigate(['/user/userviewfeedback']); //Redirect to userviewfeedback component

      });
    });
  }
}
 
 
 
 