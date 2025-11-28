import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PlanapplicationformService } from 'src/app/services/planapplicationform.service';
import { SavingsplanService } from 'src/app/services/savingsplan.service';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css'],
  animations: [
    // Animation for expanding/collapsing sections
    trigger('expandCollapse', [
      state(
        'expanded',
        style({
          height: '*',
          opacity: 1,
          overflow: 'auto',
        })
      ),
      state(
        'collapsed',
        style({
          height: '0px',
          opacity: 0,
          overflow: 'hidden',
        })
      ),
      transition('expanded <=> collapsed', [animate('300ms ease-in-out')]),
    ]),
    // Animation for cards
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class ManagerDashboardComponent implements OnInit {
  totalSavingsPlans: number = 0;
  activeSavingsPlans: number = 0;
  inactiveSavingsPlans: number = 0;

  totalPlanApplications: number = 0;
  approvedPlanApplications: number = 0;
  rejectedPlanApplications: number = 0;

  totalFeedbacks: number = 0;
  totalEnrollments: number = 0;

  recentActivities: any[] = [];
  pendingTasks: string[] = [];
  showActivities: boolean = false; // For toggling recent activities
  showCards: boolean = false;

  constructor(
    private savingsPlanService: SavingsplanService,
    private planApplicationService: PlanapplicationformService,
    private feedbackService: FeedbackService
  ) {}

  ngOnInit(): void {
    this.fetchDashboardData();
    
  }

  fetchDashboardData(): void {
    this.fetchSavingsPlans();
    this.fetchPlanApplicationStats();
    this.fetchFeedbacks();
    this.fetchEnrollments();
  }

  fetchSavingsPlans(): void {
    this.savingsPlanService.getAllSavingsPlans().subscribe(
      (data) => {
        this.totalSavingsPlans = data.length;
        this.activeSavingsPlans = data.filter((plan) => plan.Status === 'Active').length;
        this.inactiveSavingsPlans = data.filter((plan) => plan.Status === 'Inactive').length;
      },
      (error) => {
        console.error('Error fetching savings plans:', error);
      }
    );
  }

  fetchPlanApplicationStats(): void {
    this.planApplicationService.getAllPlanApplications().subscribe(
      (data) => {
        this.totalPlanApplications = data.length;
        this.approvedPlanApplications = data.filter((plan) => plan.Status === 'Approved').length;
        this.rejectedPlanApplications = data.filter((plan) => plan.Status === 'Rejected').length;
      },
      (error) => {
        console.error('Error fetching plan applications:', error);
      }
    );
  }

  fetchFeedbacks(): void {
    this.feedbackService.getFeedbacks().subscribe(
      (data) => {
        this.totalFeedbacks = data.length;
      },
      (error) => {
        console.error('Error fetching feedbacks:', error);
      }
    );
  }

  fetchEnrollments(): void {
    this.planApplicationService.getAllPlanApplications().subscribe(
      (data) => {
        this.totalEnrollments = data.length;
      },
      (error) => {
        console.error('Error fetching feedbacks:', error);
      }
    );
  }
  
  showAnimations = false;
  toggleAnimations(): void {
    this.showAnimations = !this.showAnimations;
    const newState = this.showAnimations ? 'visible' : 'hidden';
  }

  toggleActivities(): void {
    this.showActivities = !this.showActivities;
    console.log('Show Activities:', this.showActivities); // Debugging log
  }


  scrollToDashboard(): void {
    const dashboardSection = document.querySelector('#dashboard');
    if (dashboardSection) {
      this.showCards = true; // Ensure content is displayed
      dashboardSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}