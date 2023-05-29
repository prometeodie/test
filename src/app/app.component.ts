import { Component, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private authService = inject(AuthService);
  public router = inject(Router);

  constructor(){
    this.authService.checkAuthStatus().subscribe();
  }

  public authStatusChangeEfect = effect(()=>{

    switch (this.authService.authStatus()){

      case AuthStatus.checking:
        return;

      case AuthStatus.authenticated:
        this.router.navigateByUrl('/dashboard/warehouse-list')
        return;

      case AuthStatus.noAuthenticated:
        this.router.navigateByUrl('/auth/login')
        return;
    }
  })

}
