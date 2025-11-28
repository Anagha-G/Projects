import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PlanApplication } from '../models/planapplication.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PlanapplicationformService {

  public baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken'); // Retrieve token from local storage
    if (!token) {
        throw new Error('User is not authenticated.');
    }

    return new HttpHeaders({
        Authorization: `Bearer ${token}`
    });
  }

  addPlanApplication(data: PlanApplication): Observable<PlanApplication> {
    return this.http.post<PlanApplication>(`${this.baseUrl}/PlanApplication`, data, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }
    
    deletePlanApplication(planId: number): Observable<void> {
       const url = `${this.baseUrl}/PlanApplication/${planId}`;
       return this.http.delete<void>(url, { headers: this.getAuthHeaders() })
       .pipe(
          catchError(this.handleError)
          );
      }

    getAppliedPlans(userId: number): Observable<PlanApplication[]> {
       const url = `${this.baseUrl}/PlanApplication/user/${userId}`;
       return this.http.get<PlanApplication[]>(url, { headers: this.getAuthHeaders() })
          .pipe( 
            catchError(this.handleError)
          );
     }

     
      getAllPlanApplications(): Observable<PlanApplication[]> {
       return this.http.get<PlanApplication[]>(`${this.baseUrl}/PlanApplication`, { headers: this.getAuthHeaders() })
       .pipe(
         catchError(this.handleError)
         );
     }
     
      updatePlanApplication(planId: number, updatedData: PlanApplication): Observable<PlanApplication> {
      const url = `${this.baseUrl}/PlanApplication/${planId}`;
      return this.http.put<PlanApplication>(url, updatedData, { headers: this.getAuthHeaders() })
       .pipe(
        catchError(this.handleError)
        );
       }
  
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
