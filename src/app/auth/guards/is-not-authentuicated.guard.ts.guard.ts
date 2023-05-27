import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces';
import { ParseTreeResult } from '@angular/compiler';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);

  if( authService.authStatus() === AuthStatus.authenticated){
    return false;
  }

  return true;
};
