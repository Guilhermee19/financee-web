import { Component, Input, OnInit } from '@angular/core';
import { GRADIENTS } from '../../../constants/gradients';
import { CommonModule } from '@angular/common';
import { InitialLettersDirective } from '../../../directives/initial-letters.directive';

@Component({
  selector: 'avatar',
  standalone: true,
  imports: [CommonModule, InitialLettersDirective],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  @Input() name = 'Foo Bar';
  @Input() src = '';
  @Input() length = 2;
  @Input() bg = '';
  @Input() color: 'dark' | 'light' | '' = '';

  gradients = GRADIENTS;
  gradient = this.gradients[0];

  ngOnInit(): void {
    this.gradient =
      this.gradients[Math.floor(Math.random() * this.gradients.length)];

    this.color = this.color || this.gradient.color;
    this.bg = this.bg || this.gradient.bg;
  }
}
