import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const expectedRole = route.data['expectedRole'];
  if (!authService.isLoggedIn()) {
    // Redirect to login page if the user is not logged in
    if(expectedRole == "customer"){ //if try to access features that requires login for customer
      router.navigate(['login']);
      return false;
    }
    
    router.navigate([`${expectedRole}/login`]);
    return false;
  }

  const userRole = authService.getUserRole();
  if (userRole === expectedRole) {
    return true;
  } 

  // If the user doesn't have the expected role, redirect to a 'not authorized' page
  router.navigate(['/not-authorized']);
  return false;
};
