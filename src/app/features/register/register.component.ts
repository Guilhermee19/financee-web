import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Md5 } from 'md5-typescript';
import { environment } from '../../../environments/environment';
import { IRegister } from '../../core/models/user';
import { IconDirective } from '../../shared/directives/icon.directive';
import { LoadingStateDirective } from '../../shared/directives/loading.directive';
import { AuthService } from '../../shared/services/auth.service';
import { BodyJson } from '../../shared/services/http.service';
import { StorageService } from '../../shared/services/storage.service';
import { Toastr } from '../../shared/services/toastr.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
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
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirm_password: ['', Validators.required],
    remember: [false],
  });

  public handleFormSubmit(){
    if (this.loading()) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);

    const user: IRegister = {
      name: this.form.value.name || '',
      email: this.form.value.email || '',
      password: Md5.init(this.form.value.password).toUpperCase(),
    }

    this.userService.createUser(user as unknown as BodyJson).subscribe(
      () => {
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

  loginUser(user: IRegister) {
    this.loading.set(true);

    this.authService.login(user as BodyJson).subscribe({
      next: (data) => {
        this.storage.setToken(data.token, false);
        this.storage.changeUser();
      },
    });
  }
}
