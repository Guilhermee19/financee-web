import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { IconDirective } from '../../shared/directives/icon.directive';

// Register all Community features
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    IconDirective,
  ],
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {

  public ngOnInit() {
    console.log('----')
  }
}
