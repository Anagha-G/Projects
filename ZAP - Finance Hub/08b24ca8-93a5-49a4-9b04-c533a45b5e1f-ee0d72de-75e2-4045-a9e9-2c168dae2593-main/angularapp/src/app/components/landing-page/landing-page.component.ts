import { Component, OnInit } from '@angular/core';
import { SavingsplanService } from 'src/app/services/savingsplan.service';
import { SavingsPlan } from 'src/app/models/savingsplan.model';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  
  cards: SavingsPlan[] = [];
  activeCards: SavingsPlan[] = [];
  zoomStates: boolean[] = [];
  isHovered: boolean = false;
  isZoomed: boolean = false;

  constructor(private savingPlanService: SavingsplanService) {}

  ngOnInit(): void {
    this.fetchSavingPlans();
  }

  fetchSavingPlans(): void {
    this.savingPlanService.getAllSavingsPlans().subscribe(
      (data: SavingsPlan[]) => {
        this.cards = data;
        this.activeCards = this.cards.filter(
          (plan) => plan.Status?.toLowerCase() === 'active'
        );
        this.zoomStates = Array(this.activeCards.length).fill(false);
      },
      (error) => {
        console.error('Error fetching saving plans:', error);
      }
    );
  }

  toggleZoom(index: number): void {
    if (this.zoomStates[index]) {
      this.zoomStates[index] = false;
      this.isZoomed = false;
    } else {
      this.zoomStates = this.zoomStates.map((_, i) => i === index);
      this.isZoomed = true;
    }
  }

  pauseAnimation(): void {
    this.isHovered = true;
  }

  resumeAnimation(): void {
    if (!this.isZoomed) {
      this.isHovered = false;
    }
  }
}