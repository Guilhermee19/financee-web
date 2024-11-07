import { afterNextRender, Component, ElementRef, HostListener, inject, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AvatarComponent } from '../shared/avatar/avatar.component';
import { IconDirective } from '../../directives/icon.directive';
import { MatMenuModule } from '@angular/material/menu';
import { IUser } from '../../models/user';
import { StorageService } from '../../services/storage.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, AvatarComponent, IconDirective, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @ViewChild('menuContainer') public menuContainer?: ElementRef;
  private storage = inject(StorageService);
  private userService = inject(UserService);

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

  user: IUser = {} as IUser;

  public ngOnInit(): void {
    // this.connectSocket()
    this.getMe();

    this.storage.watchUser().subscribe({
      next: () => {
        this.getMe();
      },
    });
  }

  public getMe() {
    this.user = this.storage.myself;

    if (this.storage.token) {
      this.loading = true;
      this.userService.getMe().subscribe({
        next: (data) => {
          this.user = data;
          this.storage.myself = data;

          this.loading = false;
        },
        error: (error) => {
          if (error?.status === 401) {
            this.storage.logout();
          }
          this.loading = false;
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

  @HostListener('window:resize')
  public onResize(): void {
    if (!this.menuContainer) return;
    this.scrollHeightMenuContainer.set('0px');
    this.isMenuOpen.set(false);
    this.checkMenuHeight();
  }


}

