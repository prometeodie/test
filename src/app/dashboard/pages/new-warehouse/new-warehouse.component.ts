import { Component, ElementRef, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import * as XLSX from 'xlsx';
import { LatLng, Place, Warehouse } from '../../interfaces';
import { google } from "google-maps";
import Swal from 'sweetalert2';
import {Subscription, map } from 'rxjs';
import { FormsValidatorsService } from 'src/app/shared/services/forms-validators.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-new-warehouse',
  templateUrl: './new-warehouse.component.html',
  styleUrls: ['./new-warehouse.component.scss']
})
export class NewWarehouseComponent implements OnDestroy {

  private router = inject(Router);
  private  fb = inject(FormBuilder);
  private dashboardService = inject(DashboardService);
  private fvService = inject(FormsValidatorsService);
  private userAddresSuscription!: Subscription;

  private list: string[] = [];
  public fancyFileText: string = 'No File Selected';
  private autoComplete!:  google.maps.places.Autocomplete;
  private latlng:LatLng = {lat:0,lng:0}




  public myForm = this.fb.group({
    addres :['',{validators:[Validators.required,this.fvService.isValidAddres()], updateOn:'submit'}],
    code   :[0,{validators:[Validators.required, Validators.min(0)],asyncValidators:[this.fvService.duplicateCode()], updateOn:'blur'}],
    country:['',[]],
    list   :[[''] ,[]],
    name   :['',[Validators.required,Validators.minLength(2)]],
    zip    :[0,[Validators.min(0)]]
  })

  @ViewChild("file", {read: ElementRef}) file!: ElementRef;
  @ViewChild('addres') addres!:ElementRef;

  ngAfterViewInit(): void {
    this.autoComplete = new google.maps.places.Autocomplete(this.addres.nativeElement);
    this.dashboardService.autoCompleteWarehouse(this.autoComplete);
  }

    ngOnDestroy(): void {
      if(this.userAddresSuscription ) this.userAddresSuscription.unsubscribe();
    }

  get currentWarehouse():Warehouse{
    const warehouse:Warehouse = {...this.myForm.value, latLng: this.latlng} as Warehouse;
    return warehouse;
  }

  // gets the name of the excel file to show in the input file
  getFileName(){
    this.fancyFileText = this.file.nativeElement.files[0].name;
  }

  addNewWarehouse():void{
    this.myForm.markAllAsTouched();
    if (this.myForm.invalid || !this.fvService.googleResponseOK()) {return;};

    Swal.fire({
      title: 'Do you want to save a new Warehouse?',
      text: "",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const warehouse: Warehouse = this.currentWarehouse;
        warehouse.list = this.list;
        this.dashboardService.PostNewWarehouse(warehouse).subscribe(
          resp=>{
            this.myForm.reset()
            this.router.navigateByUrl('dashboard/warehouse-list');
          }
        );
      }
    })

  }

  autocompleteFormFields(){
    this.userAddresSuscription = this.dashboardService.getPlaceWarehouse().pipe(
      map((place)=>{
        if(!place?.formatted_address) return;
        this.fvService.googleResponseOK.set(true);
        this.myForm.get('addres')?.setValue(place!.formatted_address);
        this.myForm.get('country')?.setValue(place!.country);
        this.fillLatLng(place);
      })
    ).subscribe()
  }
  //every time that the user click on the input it will be reset, forcing the user to select a google response addres.
  onFocusInput(field:string){
    this.myForm.get(field)?.reset();
    this.myForm.get('country')?.reset;
    this.fvService.googleResponseOK.set(false);
  }

  fillLatLng(place:Place | null):void{

    if(!place!.location.lat() && !place!.location.lng()){this.latlng = {lat:0,lng:0}; return;}
    const lat = place!.location.lat();
    const lng = place!.location.lng();

      this.latlng = {lat,lng};
  }

    readExcel (event:any):void{
    this.getFileName();
    const file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e)=>{
      let workBook = XLSX.read(fileReader.result,{type:'binary'});
      let sheetNames = workBook.SheetNames;
      this.list = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]])
    }
  }


  isValidField(field: string):boolean | null{
    return this.fvService.isValidField(this.myForm,field);
  }

  showError( field:string){
    return this.fvService.showError(this.myForm,field);
  }

}


