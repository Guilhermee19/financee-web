import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PlansService } from '../../services/plans.service';
import { IPlan } from '../../models/plan';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './plans.component.html'
})
export class PlansComponent implements OnInit {
  private plansService = inject(PlansService)
  public user_plan = 0;

  public plans: IPlan[] = []

  ngOnInit(): void {
    this.getAllPlans()
  }

  getAllPlans(){
    this.plansService.getAllPlans().subscribe({
      next: (data) =>{
        this.plans = data
      }
    })
  }
}
