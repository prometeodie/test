import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.scss']
})
export class WarehouseListComponent implements OnInit,OnDestroy{
  private authService = inject(AuthService);
  subscription!: Subscription;

  //HOOKS
  ngOnInit(): void {
    this.subscription = this.authService.checkAuthStatus().subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}


