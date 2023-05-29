
import { AfterViewInit, Component, OnInit, ViewChild, inject, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../../services/dashboard.service';
import { Warehouse } from '../../interfaces';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';



@Component({
  selector: 'component-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit, OnDestroy {

  private dashboardService = inject(DashboardService);
  private warehousesSubscription: Subscription[] = [];

  displayedColumns: string[] = ['code','name','addres','country','zip','actions'];
  dataSource = new MatTableDataSource<Warehouse>([]);

  @ViewChild(MatPaginator)
    paginator!: MatPaginator;

  // HOOKS
  ngOnInit(): void {
    this.getWarehouses();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnDestroy(): void {
      this.warehousesSubscription.map(subscription => subscription.unsubscribe());
  }

  getWarehouses(){
    this.warehousesSubscription.push(this.dashboardService.getWarehouse().subscribe(warehouses => {this.dataSource.data = warehouses;}))
  }

  // download the warehouse's list in an excel file
  downloadList(id:string){
    this.dashboardService.downloadExcel(id);
  }

  deleteWarehouse(id:string,name:string){

      Swal.fire({
        title: `Delete warehouse ${name}?`,
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {

      this.warehousesSubscription.push(this.dashboardService.deleteWarehouse(id)
        .subscribe(resp =>{
          if(!resp){
              Swal.fire(
                'Error',
                'Something goes wrong!!!',
                'error'
              )
              return;
            }
              Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
            )
          this.getWarehouses(); // refresh warehouse's list
        },
        ))
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Cancelled',
          'Your file is safe :)',
          'error'
        )
      }
    })
  }
}

