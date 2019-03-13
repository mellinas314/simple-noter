import { UserService } from 'src/services/user/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NonAuthGuard implements CanActivate {

  constructor(
    private userS: UserService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.userS.isLogged().pipe( map( data => {
          const canActivate = !data;
          if(!canActivate) {
            this.router.navigate(['home']);
          }
          return canActivate;
      }));
  }
}
