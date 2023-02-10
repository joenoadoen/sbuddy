import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardsGuard implements CanActivate {
  constructor(private router: Router) {}

  //Einrichten des Auth Guards -> Berechtigung für Zugang nur für eingeloggte User, sonst Rückführung auf login-page
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (window.localStorage.getItem('isLoggedIn')) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
  
}
