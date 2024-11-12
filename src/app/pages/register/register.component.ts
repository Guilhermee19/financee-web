import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { LoadingStateDirective } from '../../directives/loading.directive';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { IconDirective } from '../../directives/icon.directive';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Md5 } from 'md5-typescript';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { BodyJson } from '../../services/http.service';
import { StorageService } from '../../services/storage.service';
import { Toastr } from '../../services/toastr.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterOutlet,
    RouterModule,
    FormsModule,
    IconDirective,
    ReactiveFormsModule,
    LoadingStateDirective
  ],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private storage = inject(StorageService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private toastr = inject(Toastr);

  public loading = signal(false);
  public version = environment.version
  public showPassword = signal(false);
  public showConfirm = signal(false);

  public form = this.fb.nonNullable.group({
    name: ['admin', [Validators.required]],
    email: ['admin@admin.com', [Validators.required, Validators.email]],
    password: ['admin', Validators.required],
    confirm_password: ['admin', Validators.required],
    remember: [false],
  });

  public handleFormSubmit(){
    if (this.loading()) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);

    const user = {
      name: this.form.value.name,
      email: this.form.value.email,
      password: Md5.init(this.form.value.password).toUpperCase(),
    }

    this.userService.createUser(user as unknown as BodyJson).subscribe(
      (data) => {
        this.loading.set(false);
        this.loginUser(user);
      },
      (error) => {
        this.loading.set(false);

        if (error?.error?.non_field_errors != null) {
          this.toastr.error('Não é possível realizar o cadastro com as informações fornecidas.');
        } else {
          this.toastr.error('Não foi possível concluir o cadastro, por favor verifique as informações inseridas.');
        }
      }
    );
  }

  loginUser(user: any) {
    this.loading.set(true);

    this.authService.login(user as BodyJson).subscribe({
      next: (data) => {
        this.storage.setToken(data.token, false);
        this.storage.changeUser();
      },
    });
  }
}
