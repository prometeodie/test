import { Component, AfterViewInit, inject, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { google } from "google-maps";
import { MapsService } from '../../services/maps.service';
import { Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

export  interface SideNavItems{
  label:string;
  roles:string[]
  icon:string;
  url:string;
}
@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.scss']
})
export class LayoutPageComponent implements   AfterViewInit, OnDestroy{


  private  mapsService = inject(MapsService);
  private router = inject(Router);
  private authService = inject(AuthService);
  public currentUserRole = this.authService.currentUser()?.roles;
  private autoComplete:  google.maps.places.Autocomplete | undefined;
  private subscription!:Subscription;
   @ViewChild('inpuField') inpuField!:ElementRef;

  //HOOKS
  ngAfterViewInit(): void {
    if(this.inpuField){ //google autocomplete request
        this.autoComplete = new google.maps.places.Autocomplete(this.inpuField.nativeElement);
        this.autoComplete.addListener('place_changed',()=>{
          this.mapsService.autoComplete(this.autoComplete!);
        })
      }
    }

  ngOnDestroy(): void {
    if(this.subscription){this.subscription.unsubscribe()};
    }

  navigateToMap(){
   this.subscription = this.mapsService.getPlaces()
    .pipe(
      map((resp)=>{
        if(!resp){return};
        if(this.mapsService._AutocompleteResponse()){
          this.router.navigateByUrl('dashboard/map');
        }
    })
    ).subscribe();
  }

  resetInput(){
    if(this.inpuField) this.inpuField.nativeElement.value ='';
  }


}
