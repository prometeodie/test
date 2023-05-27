import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormGroup, ValidatorFn } from '@angular/forms';
import { map } from 'rxjs';
import { Warehouse } from 'src/app/dashboard/interfaces';
import { environment } from 'src/assets/environments/environment';
import { google } from "google-maps";

@Injectable({
  providedIn: 'root'
})
export class FormsValidatorsService {
  public  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  private http = inject(HttpClient);
  public googleResponseOK= signal<boolean>(false); //this signal is lisening to the google reponse changes, true = valid addres
  constructor() { }

  isValidField(myForm: FormGroup,field: string):boolean | null{
    return myForm.get(field)!.errors &&
           myForm.get(field)!.touched
  }

  showError(form: FormGroup, field: string):string | null{
    if (!form.contains(field)) return null;

    const errors = form.get(field)!.errors || {};

    const errorMenssages:any = {
      required: 'This field is required',
      validAddres:'Select a valid addres',
      minlength:`Minimun lenght accepted ${errors['minlength']?.requiredLength}`,
      min:`Minimun value accepted ${errors['min']?.min}`,
      duplicateCode:`The code ${form.get(field)?.value} is already taken.`,
      pattern:'Invalid'
    }

    for (const key of Object.keys(errors)) {
        return errorMenssages[key];
    }

    return null;
  }

  isValidAddres():ValidatorFn{

    return (control:AbstractControl)=>{
     return (control.touched && !this.googleResponseOK())? {validAddres:true} : null;
    }
  }
  // Async functions

 duplicateCode(): AsyncValidatorFn{

    const baseUrl: string = environment.baseUrl;
    return (control: AbstractControl)=>{
     return this.http.get<Warehouse[]>(`${baseUrl}/warehouses`).pipe(
      map(warehouses => {
        const isValid = warehouses.map(warehouse=>{ return warehouse.code}).includes(control.value);
        return (!isValid)? null : {duplicateCode:true};
      })
     )
  }}



  }

