import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from '../material/material.module';

import { HeaderComponent } from './components/header/header.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MapComponent } from './pages/map/map.component';
import { NewWarehouseComponent } from './pages/new-warehouse/new-warehouse.component';
import { SharedModule } from "../shared/shared.module";
import { TableComponent } from './components/table/table.component';
import { WarehouseListComponent } from './pages/warehouse-list/warehouse-list.component';


@NgModule({
    declarations: [
        HeaderComponent,
        LayoutPageComponent,
        MapComponent,
        NewWarehouseComponent,
        TableComponent,
        WarehouseListComponent
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        SharedModule,
    ]
})
export class DashboardModule { }
