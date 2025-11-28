import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback } from '../models/feedback.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
    private baseUrl = environment.apiUrl;

    // Helper method to get Authorization headers
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('jwtToken'); // Retrieve token from local storage
        if (!token) {
            throw new Error('User is not authenticated.');
        }

        return new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
    }

    constructor(private http: HttpClient) {}

    // Method to send feedback as a Customer
    sendFeedback(feedback: Feedback): Observable<any> {
        return this.http.post(`${this.baseUrl}/feedback`, feedback, {
            headers: this.getAuthHeaders()
        });
    }

    // Method to get all feedbacks as a Regional Manager
    getFeedbacks(): Observable<Feedback[]> {
        return this.http.get<Feedback[]>(`${this.baseUrl}/feedback`, {
            headers: this.getAuthHeaders()
        });
    }

    // Method to get feedbacks by userId as a Customer
    getAllFeedbacksByUserId(userId: string): Observable<Feedback[]> {
        return this.http.get<Feedback[]>(`${this.baseUrl}/feedback/user/${userId}`, {
            headers: this.getAuthHeaders()
        });
    }

    // Method to delete feedback by feedbackId as a Customer
    deleteFeedback(feedbackId: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/feedback/${feedbackId}`, {
            headers: this.getAuthHeaders()
        });
    }
}