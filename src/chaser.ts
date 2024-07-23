const haversineDistance = ({ lat1, lng1, lat2, lng2 }: { lat1: number; lng1: number; lat2: number; lng2: number }) => {
  const R = 6371.071; // Radius of the Earth in meters
  const rlat1 = lat1 * (Math.PI / 180); // Convert degrees to radians
  const rlat2 = lat2 * (Math.PI / 180); // Convert degrees to radians
  const difflat = rlat2 - rlat1; // Radian difference (latitudes)
  const difflon = (lng2 - lng1) * (Math.PI / 180); // Radian difference (longitudes)

  const d =
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)
      )
    );

  return d;
};

export default class Chaser {
  private _lat: number;
  private _lng: number;

  constructor(lat: number, lng: number) {
    this._lat = lat;
    this._lng = lng;
  }

  get lat(): number {
    return this._lat;
  }

  get lng(): number {
    return this._lng;
  }

  set lat(lat: number) {
    this._lat = lat;
  }

  set lng(lng: number) {
    this._lng = lng;
  }

  getDistance = ({ lat, lng }: { lat: number; lng: number }) =>
    haversineDistance({ lat1: lat, lng1: lng, lat2: this._lat, lng2: this._lng });
}
