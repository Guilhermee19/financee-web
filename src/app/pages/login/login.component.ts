import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { Md5 } from 'md5-typescript';
import { AuthService } from '../../services/auth.service';
import { BodyJson } from '../../services/http.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private storage = inject(StorageService);

  public loading = false;

  public form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false],
  });

  public handleFormSubmit(){
    if (this.loading) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    const body = {
      email: this.form.value.email,
      password: Md5.init(this.form.value.password).toUpperCase(),
    }

    this.authService.login(body as unknown as BodyJson).subscribe(
      (data) => {
        this.storage.setToken(data.token, true);
      },
      () => {
        this.loading = false;
      }
    );
  }

  public handleForgotPasswordButton() {

  }
}
