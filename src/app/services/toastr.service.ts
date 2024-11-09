import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class Toastr {
  constructor(private toastr: ToastrService) {}

  info(message: string) {
    this.toastr.info(message);
  }

  success(message: string) {
    this.toastr.success(message);
  }

  warning(message: string) {
    this.toastr.warning(message);
  }

  error(message: string) {
    this.toastr.error(message);
  }
}
