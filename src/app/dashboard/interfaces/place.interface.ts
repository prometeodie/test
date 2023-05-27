import { google } from "google-maps";

    export interface Place{
      name: string;
      location: google.maps.LatLng;
      country: string;
      formatted_address: string;
    }

    export interface Location{
      location:{lat:number,lng:number}
    }
