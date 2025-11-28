import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  errorMessage: string = 'Something Went Wrong';
  errorInformation: string = 'We\'re sorry, but an error occurred. Please try again later.';
 
  constructor() { }

  ngOnInit(): void {
  }

}
