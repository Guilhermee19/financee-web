import { CommonModule } from '@angular/common';
import { afterNextRender, Component, ElementRef, HostListener, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { ToggleThemeComponent } from "../../../shared/components/toggle-theme/toggle-theme.component";
import { IconDirective } from '../../../shared/directives/icon.directive';
import { AuthService } from '../../../shared/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';
import { NAVBAR_PAGES } from '../../constants/navbar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, AvatarComponent, IconDirective, MatMenuModule, ToggleThemeComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  @ViewChild('menuContainer') public menuContainer?: ElementRef;
  private storage = inject(StorageService);
  private authService = inject(AuthService);

  public loading = signal(true);
  public error = 0;
  public scrollHeightMenuContainer = signal('0px');
  public isMenuOpen = signal(false);

  private metric_mobile = 768;

  navbars = NAVBAR_PAGES

  public user = this.storage.myself;

  public ngOnInit(): void {
    this.getMe();

    this.storage.watchUser().subscribe({
      next: () => {
        this.getMe();
      },
    });
  }

  public getMe() {
    if (this.storage.token) {
      this.loading.set(true);

      this.authService.getMe().subscribe({
        next: (data) => {
          this.user = data
          this.storage.myself = data;
          this.loading.set(false);
        },
        error: (error) => {
          if (error?.status === 401) {
            this.storage.logout();
          }
          this.loading.set(false);
        },
      });
    } else {
      this.storage.logout();
    }
  }

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

  public logout(){
    this.storage.logout()
  }

  @HostListener('window:resize')
  public onResize(): void {
    if (!this.menuContainer) return;
    this.scrollHeightMenuContainer.set('0px');
    this.isMenuOpen.set(false);
    this.checkMenuHeight();
  }


}

