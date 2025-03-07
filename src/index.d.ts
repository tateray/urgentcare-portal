
declare module 'leaflet' {
  export interface LeafletEventHandlerFn {
    (ev: LeafletEvent): any;
  }
}
