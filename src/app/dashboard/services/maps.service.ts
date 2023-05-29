import { Injectable, inject, signal } from '@angular/core';
import {  BehaviorSubject } from 'rxjs';
import { google } from "google-maps";
import { CenterAddres } from '../interfaces';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { environment } from 'src/assets/environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class MapsService {

  private readonly baseUrl: string = environment.baseUrl;
  private route = inject(Router);
  private _place$ = new BehaviorSubject<CenterAddres>({ latLng:{lat:0,lng:0}, addresTitle:'' });
  public _AutocompleteResponse = signal<boolean>(false);

  private get place$() {
    return this._place$;
  }
  private set place$(value) {
    this._place$ = value;
  }

  // to search a place
  setPlaces(place: CenterAddres) {
    this.place$.next(place);
  }

  getPlaces() {
    return this.place$.asObservable();
  }

  // gets the latitude and longitude from the place that the user has chose
  autoComplete(autoComplete: google.maps.places.Autocomplete):void{

      const placeResponse = autoComplete.getPlace();
      let lat:number = 0;
      let lng:number = 0;
      const text ='Something goes Wrong, please select a correct Addres';

        if(!placeResponse.place_id){
          this._AutocompleteResponse.set(false);
          this.menssageScreenPopUp(text,'error',2000);
          this.route.navigateByUrl('dasboard/warehouse-list');
          return;
        }
        this._AutocompleteResponse.set(true);
      lat = placeResponse.geometry?.location.lat()!,
      lng = placeResponse.geometry?.location.lng()!,

        this.setPlaces( { latLng:{lat, lng}, addresTitle:placeResponse.formatted_address! });

  }
  // shows a screen pop-up error when the direction doesn't exist
  menssageScreenPopUp(text:string, icon:SweetAlertIcon, timer:number){
    Swal.fire({
      position: 'center',
      icon,
      title: text,
      showConfirmButton: false,
      timer
    })
  }

}

