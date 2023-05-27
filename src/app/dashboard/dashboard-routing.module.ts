import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { hasRoleGuard } from './guards/has-role.guard';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MapComponent } from './pages/map/map.component';
import { NewWarehouseComponent } from './pages/new-warehouse/new-warehouse.component';
import { WarehouseListComponent } from './pages/warehouse-list/warehouse-list.component';


const routes: Routes = [
  {
    path:'',
    component: LayoutPageComponent,
    children:[
      {path:'map',canActivate:[hasRoleGuard],data:{allowedRoles:['ADMIN']},component: MapComponent },
      {path:'new-warehouse',canActivate:[hasRoleGuard],data:{allowedRoles:['ADMIN','USER']}, component: NewWarehouseComponent },
      {path:'warehouse-list',component: WarehouseListComponent},
      {path: '**', redirectTo:'warehouse-list',}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
