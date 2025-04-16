import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { IPlan } from '../../core/models/plan';
import { IconDirective } from '../../shared/directives/icon.directive';
import { PlansCheckPipe } from '../../shared/pipes/plans-check.pipe';
import { PlansService } from '../../shared/services/plans.service';
import { StorageService } from '../../shared/services/storage.service';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, MatButtonModule, PlansCheckPipe, IconDirective],
  templateUrl: './plans.component.html'
})
export class PlansComponent implements OnInit {
  private plansService = inject(PlansService)
  private storage = inject(StorageService)

  public user_plan = this.storage.myself.plan_obj;

  public plans: IPlan[] = []

  public ngOnInit(): void {
    this.getAllPlans()
  }

  public getAllPlans(){
    this.plansService.getAllPlans().subscribe({
      next: (data) =>{
        this.plans = data
      }
    })
  }
}
