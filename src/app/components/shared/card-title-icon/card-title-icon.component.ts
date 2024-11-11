import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
// import { IconDirective } from '../../../directives/icon.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-title-icon',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './card-title-icon.component.html'
})
export class CardTitleIconComponent {
  // @Input() public icon!: keyof IconDirective['icon']
  @Input() public title = '';
  @Input() public theme = 'default';
}
