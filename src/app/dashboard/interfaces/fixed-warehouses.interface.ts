import { LatLng } from "./latLng.interface";
import { Distance } from "./warehouses-distances.interface";


export interface FitWarehouses{
  name:string,
  addres:string,
  latLng?: LatLng,
  distance?:Distance,
  duration?:Distance,
  status:string
}

