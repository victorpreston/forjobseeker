import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const userRole = this.authService.getUserRole();

    if (userRole === 'ADMIN') {
      this.router.navigate(['/admin']);
      return true;
    } else if (userRole === 'COMPANY') {
      this.router.navigate(['/company']);
      return true;
    } else if (userRole === 'JOBSEEKER') {
      this.router.navigate(['/jobseeker']);
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}