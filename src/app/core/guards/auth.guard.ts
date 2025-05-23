import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../../shared/services/storage.service';

export const authGuard: CanActivateFn = () => {
  // const platformId = inject(PLATFORM_ID);
  // if (isPlatformServer(platformId)) return true;

  const storage = inject(StorageService);
  const router = inject(Router);
  const token = storage.token;
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
