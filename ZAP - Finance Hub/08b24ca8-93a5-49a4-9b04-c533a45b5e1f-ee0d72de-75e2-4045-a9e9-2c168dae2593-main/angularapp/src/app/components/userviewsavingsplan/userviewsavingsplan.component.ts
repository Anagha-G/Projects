import { Component, OnInit } from '@angular/core';
import { SavingsplanService } from 'src/app/services/savingsplan.service';
import { Router } from '@angular/router';
import { SavingsPlan } from 'src/app/models/savingsplan.model';
import { PlanapplicationformService } from 'src/app/services/planapplicationform.service';
import { AuthService } from 'src/app/services/auth.service';
import { PlanApplication } from 'src/app/models/planapplication.model';

@Component({
  selector: 'app-userviewsavingsplan',
  templateUrl: './userviewsavingsplan.component.html',
  styleUrls: ['./userviewsavingsplan.component.css']
})
export class UserviewsavingsplanComponent implements OnInit {
  
  plans: SavingsPlan[] = [];
  appliedPlans: PlanApplication[] = [];
  filteredPlans: SavingsPlan[] = [];
  searchTerm: string = '';
  currentUser: any = null;
  isLoading: boolean = true; // Add a loading flag to manage UI rendering

  // Sorting properties
  sortColumn: string | null = null;
  sortOrder: 'asc' | 'desc' | null = null;

  constructor(
    private authService: AuthService, 
    private savingPlanService: SavingsplanService, 
    private planApplicationService: PlanapplicationformService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.loadPlansAndApplications();
  }

  loadPlansAndApplications(): void {
    // Fetch both savings plans and applied plans together
    Promise.all([
      this.savingPlanService.getAllSavingsPlans().toPromise(),
      this.planApplicationService.getAppliedPlans(this.currentUser.userId).toPromise()
    ]).then(([plans, appliedPlans]) => {
      this.plans = plans;
      this.appliedPlans = appliedPlans;

      // Set filteredPlans to plans initially
      this.filteredPlans = plans;

      this.isLoading = false; // Data loading is complete
    }).catch(error => {
      console.error('Error loading data:', error);
      this.isLoading = false; // Handle error case
    });
  }

  filterPlans(): void {
    this.filteredPlans = this.plans.filter(plan => 
      plan.Name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  isAlreadyApplied(savingsId: number): boolean {
    return this.appliedPlans.some(appliedPlan => appliedPlan.SavingsPlanId === savingsId);
  }

  applyForPlan(plan: any): void {
    this.router.navigate([`/User/PlanApplication/${plan.SavingsPlanId}`]);
  }

  // Generic sorting function with case-insensitive sorting
 sortBy(column: string): void {
  if (this.sortColumn === column) {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortOrder = 'asc';
  }

  // Perform sorting
  this.filteredPlans.sort((a, b) => {
    const valueA = a[column].toString().toLowerCase() ? a[column].toString().toLowerCase() : '';
    const valueB = b[column].toString().toLowerCase() ? b[column].toString().toLowerCase() : '';

    if (valueA == null || valueB == null) return 0;

    if (this.sortOrder === 'asc') {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    } else {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
  });
}
}