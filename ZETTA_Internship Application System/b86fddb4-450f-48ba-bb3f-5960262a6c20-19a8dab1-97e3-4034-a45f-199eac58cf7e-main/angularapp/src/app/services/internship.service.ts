import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Internship } from '../models/internship.model';
import { InternshipApplication } from '../models/internshipapplication.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InternshipService {
  getRequestedInternships() {
    throw new Error('Method not implemented.');
  }
  approveInternship(id: number) {
    throw new Error('Method not implemented.');
  }
  rejectInternship(id: number) {
    throw new Error('Method not implemented.');
  }
  public baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }


  getAllInternships(): Observable<Internship[]> {
    return this.http.get<Internship[]>(`${this.baseUrl}/api/internship`, { headers: this.getAuthHeaders() });
  }

  getInternshipById(id: number): Observable<Internship> {
    return this.http.get<Internship>(`${this.baseUrl}/api/internship/${id}`, { headers: this.getAuthHeaders() });
  }
  addInternship(requestObject: Internship): Observable<Internship> {
    return this.http.post<Internship>(`${this.baseUrl}/api/internship`, requestObject, { headers: this.getAuthHeaders() });
  }
  updateInternship(id: number, requestObject: Internship): Observable<Internship> {
    return this.http.put<Internship>(`${this.baseUrl}/api/internship/${id}`, requestObject, { headers: this.getAuthHeaders() });
  }
  deleteInternship(internshipId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/internship/${internshipId}`, { headers: this.getAuthHeaders() });
  }
  addInternshipApplication(data: InternshipApplication): Observable<InternshipApplication> {
    return this.http.post<InternshipApplication>(`${this.baseUrl}/api/internshipapplication/create`, data, { headers: this.getAuthHeaders() });
  }
  getAppliedInternships(userId: number): Observable<InternshipApplication[]> {
    return this.http.get<InternshipApplication[]>(`${this.baseUrl}/api/internshipapplication/${userId}`, { headers: this.getAuthHeaders() });
  }

  deleteInternshipApplication(internshipId: number): Observable<void> {

    return this.http.delete<void>(`${this.baseUrl}/api/internshipapplication/${internshipId}`, { headers: this.getAuthHeaders() });
  }
 
  
  getAllInternshipApplications(): Observable<InternshipApplication[]> {
    return this.http.get<InternshipApplication[]>(`${this.baseUrl}/api/internshipapplication`, { headers: this.getAuthHeaders() });
  }
  
  updateApplicationStatus(id: number, internshipApplication: InternshipApplication): Observable<InternshipApplication> {
    return this.http.put<InternshipApplication>(`${this.baseUrl}/api/internshipapplication/${id}`, internshipApplication, { headers: this.getAuthHeaders() });
  }
}













