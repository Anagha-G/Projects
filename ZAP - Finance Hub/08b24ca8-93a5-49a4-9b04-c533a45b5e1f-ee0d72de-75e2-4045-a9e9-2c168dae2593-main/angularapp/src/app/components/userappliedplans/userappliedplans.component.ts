import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PlanApplication } from 'src/app/models/planapplication.model';
import { SavingsPlan } from 'src/app/models/savingsplan.model';
import { AuthService } from 'src/app/services/auth.service';
import { PlanapplicationformService } from 'src/app/services/planapplicationform.service';
import { SavingsplanService } from 'src/app/services/savingsplan.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-userappliedplans',
  templateUrl: './userappliedplans.component.html',
  styleUrls: ['./userappliedplans.component.css']
})
export class UserappliedplansComponent implements OnInit {
  planApplications: PlanApplication[] = [];
  savingsplans: SavingsPlan[] = [];
  originalPlanApplications: PlanApplication[] = [];
  selectedImage: string | null = null;
  currentUser: any = null;
  userID: number = 0;
  isLoading: boolean = true;

  // Pagination properties
  currentPage: number = 1; // Current page
  itemsPerPage: number = 5; // Records per page

  // Sort orders for different columns
  sortPlanNameOrder: 'asc' | 'desc' | null = null;
  sortAppliedAmountOrder: 'asc' | 'desc' | null = null;
  sortApplicationDateOrder: 'asc' | 'desc' | null = null;
  sortStatusOrder: 'asc' | 'desc' | null = null;

  constructor(
    private planApplicationService: PlanapplicationformService,
    private savingsPlanService: SavingsplanService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.userID = this.currentUser.userId;
    this.loadAppliedPlans();
  }

  loadAppliedPlans(): void {
    this.planApplicationService.getAppliedPlans(this.userID).subscribe((applications: PlanApplication[]) => {
      const planRequests = applications.map((application) =>
        this.savingsPlanService.getSavingsPlanById(application.SavingsPlanId)
      );

      forkJoin([forkJoin(planRequests)]).subscribe(([plans]) => {
        applications.forEach((application, index) => {
          application.SavingsPlan = plans[index];
        });

        this.planApplications = applications;
        this.originalPlanApplications = [...this.planApplications];
      });
      this.isLoading = false;
    });
  }

  // Pagination logic
  get paginatedPlans(): PlanApplication[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.planApplications.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  totalPages(): number {
    return Math.ceil(this.planApplications.length / this.itemsPerPage);
  }

  // Sorting logic for Plan Name column
  sortPlanName(): void {
    if (this.sortPlanNameOrder === 'asc') {
      // Sort descending
      this.planApplications.sort((a, b) =>
        b.SavingsPlan?.Name.localeCompare(a.SavingsPlan?.Name)
      );
      this.sortPlanNameOrder = 'desc';
    } else if (this.sortPlanNameOrder === 'desc') {
      // Reset to original
      this.resetSorting();
    } else {
      // Sort ascending
      this.planApplications.sort((a, b) =>
        a.SavingsPlan?.Name.localeCompare(b.SavingsPlan?.Name)
      );
      this.sortPlanNameOrder = 'asc';
    }
    this.resetOtherSortOrders('sortPlanNameOrder');
  }

  // Sorting logic for Applied Amount column
  sortAppliedAmount(): void {
    if (this.sortAppliedAmountOrder === 'asc') {
      // Sort descending
      this.planApplications.sort((a, b) => b.AppliedAmount - a.AppliedAmount);
      this.sortAppliedAmountOrder = 'desc';
    } else if (this.sortAppliedAmountOrder === 'desc') {
      // Reset to original
      this.resetSorting();
    } else {
      // Sort ascending
      this.planApplications.sort((a, b) => a.AppliedAmount - b.AppliedAmount);
      this.sortAppliedAmountOrder = 'asc';
    }
    this.resetOtherSortOrders('sortAppliedAmountOrder');
  }

  // Sorting logic for Application Date column
  sortApplicationDate(): void {
    if (this.sortApplicationDateOrder === 'asc') {
      // Sort descending
      this.planApplications.sort((a, b) =>
        new Date(b.ApplicationDate).getTime() - new Date(a.ApplicationDate).getTime()
      );
      this.sortApplicationDateOrder = 'desc';
    } else if (this.sortApplicationDateOrder === 'desc') {
      // Reset to original
      this.resetSorting();
    } else {
      // Sort ascending
      this.planApplications.sort((a, b) =>
        new Date(a.ApplicationDate).getTime() - new Date(b.ApplicationDate).getTime()
      );
      this.sortApplicationDateOrder = 'asc';
    }
    this.resetOtherSortOrders('sortApplicationDateOrder');
  }

  // Sorting logic for Status column
  sortStatus(): void {
    if (this.sortStatusOrder === 'asc') {
      // Sort descending
      this.planApplications.sort((a, b) => b.Status.localeCompare(a.Status));
      this.sortStatusOrder = 'desc';
    } else if (this.sortStatusOrder === 'desc') {
      // Reset to original
      this.resetSorting();
    } else {
      // Sort ascending
      this.planApplications.sort((a, b) => a.Status.localeCompare(b.Status));
      this.sortStatusOrder = 'asc';
    }
    this.resetOtherSortOrders('sortStatusOrder');
  }

  // Reset other sort orders except the current one
  resetOtherSortOrders(currentSortOrder: string): void {
    const sortOrders = ['sortPlanNameOrder', 'sortAppliedAmountOrder', 'sortApplicationDateOrder', 'sortStatusOrder'];
    sortOrders.forEach(sortOrder => {
      if (sortOrder !== currentSortOrder) {
        this[sortOrder] = null;
      }
    });
  }

  resetSorting(): void {
    this.planApplications = [...this.originalPlanApplications];
    this.sortPlanNameOrder = null;
    this.sortAppliedAmountOrder = null;
    this.sortApplicationDateOrder = null;
    this.sortStatusOrder = null;
  }

  deletePlanApplication(planApplicationId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this plan application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#ff4d4d',
      cancelButtonColor: '#007bff'
    }).then(result => {
      if (result.isConfirmed) {
        this.planApplicationService.deletePlanApplication(planApplicationId).subscribe(() => {
          Swal.fire('Deleted!', 'Plan application has been deleted.', 'success');
          this.planApplications = this.planApplications.filter(
            app => app.PlanApplicationId !== planApplicationId
          );
          this.originalPlanApplications = this.originalPlanApplications.filter(
            app => app.PlanApplicationId !== planApplicationId
          );
        });
      }
    });
  }

  viewImage(proofDocument: string): void {
    this.selectedImage = proofDocument;
  }

  closeModal(): void {
    this.selectedImage = null;
  }
}
