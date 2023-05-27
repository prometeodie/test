import { Component, ElementRef, OnInit, ViewChild, inject, OnDestroy } from '@angular/core';
import { MapsService } from '../../services/maps.service';
import { google } from "google-maps";
import { CenterAddres, FitWarehouses, LatLng, Marker, Warehouse, WarehousesDistance } from '../../interfaces';
import { Subscription, catchError, map } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements  OnInit,OnDestroy  {

  @ViewChild('map') map!:ElementRef;
  private  mapsService      = inject(MapsService);
  private  dashboardService = inject(DashboardService);

  private closestWarehouses!: FitWarehouses[];
  public distanceMatrixPromise:any;
  public addres!: CenterAddres;
  public warehouses!: LatLng[];

  public isMapLoaded = true;
  public bounds = new google.maps.LatLngBounds();
  private mapSubscription: Subscription[] = [];


  public maps!      : google.maps.Map;
  private distanceMatrixService = new google.maps.DistanceMatrixService();

  private directionsRenderer!:  google.maps.DirectionsRenderer; //options for polyline request
  private directionsService !:  google.maps.DirectionsService; // service to make the polyline request

  //HOOKS
    ngOnInit(): void {

      this.directionsService = new   google.maps.DirectionsService();
      this.directionsRenderer = new   google.maps.DirectionsRenderer();

      this.mapSubscription.push(this.dashboardService.getWarehouse().pipe(
       map((warehouses)=> {
        this.mapSubscription.push(
          this.mapsService.getPlaces().subscribe(addres =>{
            this.addres = addres;
            this.closestWarehouse(addres.latLng,warehouses)
            this.initMap();
          })
        )}),
       catchError(err => {return err})
      ).subscribe())
    }

    ngOnDestroy(): void {
      this.addres = {addresTitle:'', latLng:{lat:0,lng:0}};
      this.mapSubscription.map(subscription=>{subscription.unsubscribe});
      this.closestWarehouses = [];
      this.mapsService._AutocompleteResponse.set(false);
    }

  initMap(){

        const {lat,lng} = this.addres.latLng;

        const options ={
          center   : new google.maps.LatLng(lat, lng),
          zoom     :17,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.maps = new google.maps.Map(this.map.nativeElement, options);
        // marker for the User's location
       const marker ={
          position: this.addres.latLng,
          map: this.maps,
          title: this.addres.addresTitle
        }
         this.addMarker(marker);
         this.fitBoundMarkers(this.addres.latLng)

  }

  closestWarehouse(location:LatLng, warehouses:Warehouse[]){

    const{lat, lng} = location;
    if(lat === 0 && lng === 0) return;
      const warehousesLocation:LatLng[] = warehouses.map(warehouses=>{return warehouses.latLng});

      const request = {
        origins     : [location],
        destinations: warehousesLocation,
        travelMode  : google.maps.TravelMode.DRIVING,
        unitSystem  : google.maps.UnitSystem.METRIC,
      }

      this.distanceMatrixPromise = this.distanceMatrixService.getDistanceMatrix( request,()=>{return})
      this.distanceMatrixPromise.then((distances:WarehousesDistance)=> {

        this.closestWarehouses = this.sortClosestWarehouses(this.fitAddress(distances,warehouses))
        this.isMapLoaded = true;
        this.renderMarkers(this.closestWarehouses);
        this.polyline(this.addres,this.closestWarehouses[0]);
      } );
    }

 fitAddress(distance:WarehousesDistance, warehouses:Warehouse[]){
  // note: google's response has an margin error with the adress, this method fix that issue
  // using the address saved in the warehouse response.

    return warehouses.map((warehouse,i)=>{

      return {
              name     : warehouse.name,
              addres   : warehouse.addres,
              latLng   : warehouse.latLng,
              distance : {...distance.rows[0]?.elements[i].distance},
              duration : {...distance.rows[0]?.elements[i].duration},
              status   : distance.rows[0].elements[i].status
                }
    }).filter( resp=> resp.status === 'OK');
 }

// sort and slice warehouse's array
 sortClosestWarehouses(warehouses:FitWarehouses[]){
  const warehouseAmount = 3;
  return warehouses.sort((a,b)=>{ return a.distance!.value - b.distance!.value }).slice(0,warehouseAmount);
 }

//  set a marker
 addMarker(marker:Marker){
  return new google.maps.Marker({
    position: marker.position,
    label: marker.label,
    map: this.maps,
    title: marker.title
  })
 }

//  transform and warehouse aareay in a marker's array and add the Markers
 renderMarkers(warehouses:FitWarehouses[]) {

  let markers!:Marker[];

  markers =  warehouses.map((warehouse,i)=>{
    const title: string = `Name: ${warehouse.name}, Addres: ${warehouse.addres}
                           Distance: ${warehouse.distance?.text} Duration: ${warehouse.duration?.text}`;
    const label = (i+1).toString();

    this.fitBoundMarkers(warehouse.latLng!)
    return {
      position: warehouse.latLng!,
      label,
      title
     }
  })

   markers.forEach((marker) => {
    this.addMarker(marker);
  });
}

  fitBoundMarkers( warehouseLatLng: LatLng ){
      this.bounds.extend(warehouseLatLng) //this method makes that all makers fit on the screen
      this.maps.fitBounds(this.bounds)
  }

  polyline(origin:CenterAddres, destination:FitWarehouses){
    let request ={
      origin: origin.latLng,
      destination: destination.latLng,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (response,status)=>{
      this.directionsRenderer.setOptions({
        suppressPolylines: false,
        suppressMarkers: true, //hidde polyline markers
        map:this.maps
      });

      if(status === google.maps.DirectionsStatus.OK){
        this.directionsRenderer.setDirections(response);
      }
    })
  }
}


