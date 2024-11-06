import { afterNextRender, Component, ElementRef, HostListener, inject, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AvatarComponent } from '../shared/avatar/avatar.component';
import { IconDirective } from '../../directives/icon.directive';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, AvatarComponent, IconDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @ViewChild('menuContainer') public menuContainer?: ElementRef;

  public loading = false;
  public error = 0;
  public scrollHeightMenuContainer = signal('0px');
  public isMenuOpen = signal(false);

  private metric_mobile = 768;

  navbars = [
    {
      label: 'Overview',
      router: '/overview'
    },
    {
      label: 'Transações',
      router: '/finance'
    },
    {
      label: 'Assinatura',
      router: '/plans'
    }
  ]

  public constructor() {
    afterNextRender(() => {
      this.onResize();
    });
  }

  public toggleMenuOpened() {
    this.isMenuOpen.set(!this.isMenuOpen());
    this.checkMenuHeight();
  }

  public checkMenuHeight() {
    if (!this.menuContainer) return;
    this.scrollHeightMenuContainer.set('0px');
    if (this.isMenuOpen() || window.innerWidth >= this.metric_mobile) {
      const ul = this.menuContainer.nativeElement.querySelector('ul');
      if (!ul) return;
      const size = ul.scrollHeight;
      this.scrollHeightMenuContainer.set(`${size}px`);
      return;
    }
  }

  @HostListener('window:resize')
  public onResize(): void {
    if (!this.menuContainer) return;
    this.scrollHeightMenuContainer.set('0px');
    this.isMenuOpen.set(false);
    this.checkMenuHeight();
  }


}

