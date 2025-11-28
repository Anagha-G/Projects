 
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback } from '../models/feedback.model';
import { environment } from 'src/environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private baseUrl = environment.apiUrl;
 
  constructor(private http: HttpClient) {}
 
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
 
  addFeedback(feedback: Feedback): Observable<Feedback> {
   
    return this.http.post<Feedback>(`${this.baseUrl}/api/feedback`, feedback, { headers: this.getAuthHeaders() });
  }
 
  getFeedbacksByUserId(userId: number): Observable<Feedback[]> {
    const url = `${this.baseUrl}/api/feedback/user/${userId}`;
    return this.http.get<Feedback[]>(url, { headers: this.getAuthHeaders() });
  }
 
  deleteFeedback(feedbackId: number): Observable<void> {
    const url = `${this.baseUrl}/api/feedback/${feedbackId}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() });
  }
 
  getFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.baseUrl}/api/feedback`, { headers: this.getAuthHeaders() });
  }
}
 
 
 
 