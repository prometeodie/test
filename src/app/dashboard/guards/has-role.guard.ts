import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "src/app/auth/services/auth.service";


export const hasRoleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoutes: string[]= route.data?.['allowedRoles'];
  const userRole = authService.currentUser()?.roles;


    if(authService.currentUser() && allowedRoutes.includes(userRole!)){
      return true;
    }

    router.navigateByUrl('dashboard/warehouse-list');
    return false;
};


