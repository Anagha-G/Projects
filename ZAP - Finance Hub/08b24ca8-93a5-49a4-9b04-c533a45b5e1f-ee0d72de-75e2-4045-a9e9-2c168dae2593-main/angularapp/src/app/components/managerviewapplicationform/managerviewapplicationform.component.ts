import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PlanApplication } from 'src/app/models/planapplication.model';
import { PlanapplicationformService } from 'src/app/services/planapplicationform.service';
import { SavingsplanService } from 'src/app/services/savingsplan.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-managerviewapplicationform',
  templateUrl: './managerviewapplicationform.component.html',
  styleUrls: ['./managerviewapplicationform.component.css']
})
export class ManagerviewapplicationformComponent implements OnInit {
  planApplications: PlanApplication[] = [];
  filteredPlanApplications: PlanApplication[] = [];
  searchPlanName: string = '';
  popupImageSrc: string = '';
  showPopup: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  isLoading: boolean = true;

  
  // Sorting state for each column
  sortOrder: { [key: string]: 'asc' | 'desc' | '' } = {
    ApplicantName: '',
    PlanName: '',
    AppliedAmount: '',
    ApplicationDate: '',
    Status: ''
  };

  constructor(
    private planApplicationformService: PlanapplicationformService,
    private savingsPlanService: SavingsplanService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchPlanApplications();
  }

  fetchPlanApplications() {
    // Step 1: Fetch all the plan applications
    this.planApplicationformService.getAllPlanApplications().subscribe((applications) => {
        // Extract unique UserIds and SavingsPlanIds
        const uniqueUserIds = [...new Set(applications.map(app => app.UserId))];
        const uniquePlanIds = [...new Set(applications.map(app => app.SavingsPlanId))];

        // Step 2: Fetch users and plans in parallel using forkJoin
        forkJoin({
            users: forkJoin(uniqueUserIds.map(id => this.authService.getUserById(id))),
            plans: forkJoin(uniquePlanIds.map(id => this.savingsPlanService.getSavingsPlanById(id)))
        }).subscribe(({ users, plans }) => {
            // Step 3: Create maps for quick lookup
            const userMap = new Map(users.map(user => [user.UserId, user]));
            const planMap = new Map(plans.map(plan => [plan.SavingsPlanId, plan])); // Ensure property name matches

            console.log('Plan Map:', planMap); // Debugging log to verify planMap data

            // Step 4: Map applications to include User and SavingsPlan data
            this.planApplications = applications.map(app => {
                const user = userMap.get(app.UserId);
                const savingsPlan = planMap.get(app.SavingsPlanId);

                // Debugging logs to verify each mapping
                console.log('Application:', app);
                console.log('Mapped User:', user);
                console.log('Mapped SavingsPlan:', savingsPlan);

                return {
                    ...app,
                    User: user,
                    SavingsPlan: savingsPlan
                };
            });
            console.log('Mapped Plan Applications:', this.planApplications); // Debugging log to verify final output
            this.filteredPlanApplications = [...this.planApplications]; // Copy mapped applications to filtered list
            this.isLoading = false;
        });
    });
}

  searchApplications() {
    const searchTerm = this.searchPlanName.toLowerCase().trim();
    if (searchTerm) {
      this.filteredPlanApplications = this.planApplications.filter(app =>
        app.SavingsPlan?.Name?.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredPlanApplications = [...this.planApplications];
    }
  }

  get paginatedApplications(): PlanApplication[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPlanApplications.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  updateApplicationStatus(application: PlanApplication, status: 'Approved' | 'Rejected') {
    console.log('Before Update:', application);
    // Create the updated application object in the format expected by the backend
    const updatedApplication = {
      PlanApplicationId: application.PlanApplicationId,
      UserId: application.User?.UserId, // Extract UserId from User object
      SavingsPlanId: application.SavingsPlan?.SavingsPlanId, // Extract SavingsPlanId from SavingsPlan object
      AppliedAmount: application.AppliedAmount,
      Status: status, // Update the status
      ApplicationDate: application.ApplicationDate,
      Remarks: application.Remarks,
      ProofDocument: application.ProofDocument
    };
    console.log(updatedApplication);
    this.planApplicationformService.updatePlanApplication(application.PlanApplicationId, updatedApplication).subscribe(() => {
        application.Status = status; // Update the status locally
    });
}
  filterApplicationsByPlanName() {
    if (this.searchPlanName.trim()) {
      this.filteredPlanApplications = this.planApplications.filter(app => 
        app.SavingsPlan?.Name?.toLowerCase().includes(this.searchPlanName.toLowerCase())
      );
    } else {
      this.filteredPlanApplications = [...this.planApplications];
    }
  }


  // Pagination logic
  get paginatedPlanApplications(): PlanApplication[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPlanApplications.slice(startIndex, startIndex + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.filteredPlanApplications.length / this.itemsPerPage);
  }
  
  // Generic sorting method for columns
  sortColumn(column: string) {
    // Toggle sort order: asc -> desc -> reset
    if (this.sortOrder[column] === 'asc') {
      this.sortOrder[column] = 'desc';
    } else if (this.sortOrder[column] === 'desc') {
      this.sortOrder[column] = '';
    } else {
      this.sortOrder[column] = 'asc';
    }

    // Clear sorting on other columns
    Object.keys(this.sortOrder).forEach(key => {
      if (key !== column) {
        this.sortOrder[key] = '';
      }
    });

    // Perform sorting
    this.filteredPlanApplications = [...this.planApplications]; // Reset to default order
    if (this.sortOrder[column] === 'asc') {
      this.filteredPlanApplications.sort((a, b) => this.compareValues(a, b, column, 'asc'));
    } else if (this.sortOrder[column] === 'desc') {
      this.filteredPlanApplications.sort((a, b) => this.compareValues(a, b, column, 'desc'));
    }
  }

  // Helper to compare values for sorting
  compareValues(a: PlanApplication, b: PlanApplication, column: string, order: 'asc' | 'desc'): number {
    const valueA = this.getColumnValue(a, column);
    const valueB = this.getColumnValue(b, column);

    if (valueA < valueB) return order === 'asc' ? -1 : 1;
    if (valueA > valueB) return order === 'asc' ? 1 : -1;
    return 0;
  }

  // Helper to retrieve column value
  getColumnValue(application: PlanApplication, column: string): any {
    switch (column) {
      case 'ApplicantName':
        return application.User?.Username || '';
      case 'PlanName':
        return application.SavingsPlan?.Name || '';
      case 'AppliedAmount':
        return application.AppliedAmount || 0;
      case 'ApplicationDate':
        return application.ApplicationDate || '';
      case 'Status':
        return application.Status || '';
      default:
        return '';
    }
  }
  
}