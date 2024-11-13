import { environment } from './../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Md5 } from 'md5-typescript';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { Toastr } from '../../services/toastr.service';
import { LoadingStateDirective } from '../../directives/loading.directive';
import { BodyJson } from '../../services/http.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    LoadingStateDirective
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private toastr = inject(Toastr);
  private authService = inject(AuthService);
  private storage = inject(StorageService);
  public version = environment.version

  public loading = signal(false);

  public form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false],
  });

  public handleFormSubmit(){
    if (this.loading()) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);

    const body = {
      email: this.form.value.email,
      password: Md5.init(this.form.value.password).toUpperCase(),
    }

    this.authService.login(body as unknown as BodyJson).subscribe(
      (data) => {
        this.storage.setToken(data.token, this.form.value.remember);
      },
      (error) => {
        if(error.status === 400){
          this.toastr.error('E-mail ou senha invalidos!')
        }
        this.loading.set(false);
      }
    );
  }

  public handleForgotPasswordButton() {

  }
}
