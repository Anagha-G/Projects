import { Component, OnInit } from '@angular/core';
import { SavingsplanService } from '../../services/savingsplan.service';
import { Router } from '@angular/router';
import { SavingsPlan } from '../../models/savingsplan.model';

@Component({
  selector: 'app-managerviewsavingsplan',
  templateUrl: './managerviewsavingsplan.component.html',
  styleUrls: ['./managerviewsavingsplan.component.css']
})
export class ManagerviewsavingsplanComponent implements OnInit {

  savingsPlans: SavingsPlan[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  isLoading: boolean= true;

  constructor(private savingsPlanService: SavingsplanService, private router: Router) { }

  ngOnInit(): void {
    this.loadSavingsPlans();
  }

  loadSavingsPlans(): void {
    this.savingsPlanService.getAllSavingsPlans().subscribe(
      data => {
        this.savingsPlans = data;
        this.isLoading = false;
      }
    );
  }

  deleteSavingsPlan(savingsPlanId: number): void {
    this.savingsPlanService.deleteSavingsPlan(savingsPlanId).subscribe(
      () => {
        this.loadSavingsPlans(); // Reload the list after deletion
      },
      error => {
        console.error('Error deleting savings plan:', error);
      }
    );
  }

  editSavingsPlan(id: number): void {
    this.router.navigate([`/Manager/EditSavingPlan/${id}`])
  }
  public get paginatedSavingsPlan(): SavingsPlan[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.savingsPlans.slice(startIndex, startIndex + this.itemsPerPage);
  }
 
  public changePage(pageNumber: number): void {
    this.currentPage = pageNumber;
  }
 
  public totalPages(): number {
    return Math.ceil(this.savingsPlans.length / this.itemsPerPage);
  }

}



