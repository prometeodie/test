

export interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  label?:string;
  title: string;
}
