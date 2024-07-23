const cat = ['cat1.gif', 'cat2.gif', 'cat3.gif', 'cat4.gif', 'cat5.gif'];

export default class Cat {
  private _img: string;
  private _lat: number;
  private _lng: number;

  constructor(lat: number, lng: number) {
    this._img = 'assets/' + cat[Math.floor(Math.random() * 5)];
    this._lat = lat;
    this._lng = lng;
  }

  get image(): string {
    return this._img;
  }

  get lat(): number {
    return this._lat;
  }

  get lng(): number {
    return this._lng;
  }
}
