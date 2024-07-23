import Overlay from './overlay';
import Chaser from './chaser';
import Cat from './cat';

const position = { lat: 53.34298855827446, lng: -6.267439131953938 };

const message = ({ dist }: { dist: number }) => {
  if (dist < 0.1) {
    return 'Close!';
  }
  if (dist < 0.5) {
    return 'Far *';
  }
  if (dist < 0.8) {
    return 'Far **';
  }
  if (dist < 1.0) {
    return 'Far ***';
  }
  if (dist < 1.5) {
    return 'Far ****';
  }
  return 'Far *****';
};

const normalizeAngle = (a: number) => {
  while (a > 180) {
    a -= 360;
  }

  while (a < -180) {
    a += 360;
  }

  return a;
};

const panWidth = 480;
const panHeight = 480;

export default class MainMap {
  private _map: google.maps.Map | null = null;
  private _pan: google.maps.StreetViewPanorama = new google.maps.StreetViewPanorama(
    document.getElementById('streetview') as HTMLElement
  );
  private _chaserMarker: google.maps.marker.AdvancedMarkerElement | null = null;
  private _catMarker: google.maps.marker.AdvancedMarkerElement | null = null;
  private _chaser: Chaser;
  private _cat: Cat | null = null;
  private _clearCallback: (({ img, url }: { img: string; url: string }) => void) | null = null;

  constructor(clearCallback: ({ img, url }: { img: string; url: string }) => void) {
    this._chaser = new Chaser(position.lat, position.lng);
    this._clearCallback = clearCallback;
  }

  getStreetViewLink = () => {
    if (this._pan) {
      const position = this._pan.getPosition();
      const pov = this._pan.getPov();
      const baseUrl = 'https://www.google.com/maps/@?api=1&map_action=pano';
      const heading = pov.heading;
      const pitch = pov.pitch;

      const url = `${baseUrl}&viewpoint=${position!.lat()},${position!.lng()}&heading=${heading}&pitch=${pitch}`;

      return url;
    }

    return '';
  };

  setCat = async () => {
    const maxLat = 53.358532600594074;
    const minLat = 53.33708468845914;
    const maxLng = -6.252062891183848;
    const minLng = -6.301669140475846;
    const lat = Math.random() * (maxLat - minLat) + minLat;
    const lng = Math.random() * (maxLng - minLng) + minLng;

    const service = new google.maps.StreetViewService();
    const { StreetViewStatus } = (await google.maps.importLibrary('streetView')) as google.maps.StreetViewLibrary;
    await service.getPanorama({ location: { lat, lng } }, async (data, status) => {
      if (status === StreetViewStatus.OK) {
        this._cat = new Cat(lat, lng);
      } else {
        await this.setCat();
      }
    });
  };

  // Initialize map.
  init = async () => {
    // Disable cat marker from previuous game.
    const markerDiv = document.getElementById('markerDiv') as HTMLElement;
    markerDiv.style.display = 'none';

    // Set cat.
    await this.setCat();

    // Generate google map.
    const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
    const map = new Map(document.getElementById('map') as HTMLElement, {
      center: position,
      zoom: 15,
      mapId: 'DEMO_MAP_ID',
    });
    this._map = map;

    // Generate Chaser marker.
    const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;
    this._chaserMarker = new AdvancedMarkerElement({
      map,
      position,
    });

    // Generate suspicious marker. (Where cat is hiding.)
    const content = document.createElement('img');
    content.src = 'assets/cat-marker2.gif';
    content.width = 40;
    content.height = 40;

    this._catMarker = new AdvancedMarkerElement({
      map,
      position: { lat: this._cat!.lat, lng: this._cat!.lng },
      content,
    });

    this.addEventHandler();
  };

  /** Reference http://projects.teammaps.com/projects/streetviewoverlay/streetviewoverlay.htm */
  /** FROM HERE */
  m_convertPointProjection = ({
    p_pov,
    p_zoom,
    sheading,
    spitch = 0,
  }: {
    p_pov: google.maps.StreetViewPov;
    p_zoom: number;
    sheading: number;
    spitch?: number;
  }) => {
    const l_fovAngleHorizontal = 90 / p_zoom;
    const l_fovAngleVertical = 90 / p_zoom;

    const l_midX = panWidth / 2;
    const l_midY = panHeight / 2;

    let l_diffHeading = sheading - p_pov.heading;
    l_diffHeading = normalizeAngle(l_diffHeading);
    l_diffHeading /= l_fovAngleHorizontal;

    const l_diffPitch = (p_pov.pitch - spitch) / l_fovAngleVertical;

    const x = l_midX + l_diffHeading * panWidth;
    const y = l_midY + l_diffPitch * panHeight;

    const l_point = new google.maps.Point(x, y);

    return l_point;
  };

  m_updateMarker = () => {
    const l_pov = this._pan.getPov();
    if (l_pov) {
      const l_zoom = this._pan.getZoom();

      // scale according to street view zoom level
      let l_adjustedZoom = Math.pow(2, l_zoom) / 2;

      // recalulate icon heading and pitch now
      const streetPt = new google.maps.LatLng({ lat: this._cat!.lat, lng: this._cat!.lng });
      const sheading = google.maps.geometry.spherical.computeHeading(streetPt, {
        lat: this._chaser.lat,
        lng: this._chaser.lng,
      });
      const distance = google.maps.geometry.spherical.computeDistanceBetween(streetPt, {
        lat: this._chaser.lat,
        lng: this._chaser.lng,
      });

      const l_pixelPoint = this.m_convertPointProjection({ p_pov: l_pov, p_zoom: l_adjustedZoom, sheading });

      const l_distanceScale = 50 / distance;
      l_adjustedZoom = l_adjustedZoom * l_distanceScale;

      // _TODO scale marker according to distance from view point to marker
      // beyond maximum range a marker will not be visible

      // apply position and size to the marker div
      const wd = 10 * l_adjustedZoom;
      const ht = 10 * l_adjustedZoom;

      const x = l_pixelPoint.x - Math.floor(wd / 2);
      const y = l_pixelPoint.y - Math.floor(ht / 2);

      const l_chaserMarkerDiv = document.getElementById('markerDiv') as HTMLElement;
      l_chaserMarkerDiv.style.display = 'block';
      l_chaserMarkerDiv.style.left = x + 'px';
      l_chaserMarkerDiv.style.top = y + 'px';
      l_chaserMarkerDiv.style.width = wd + 'px';
      l_chaserMarkerDiv.style.height = ht + 'px';
    }
  };
  /** TO HERE */

  addEventHandler = () => {
    // Call whenever Chaser center changes.
    this._map?.addListener('center_changed', () => {
      const center = this._map?.getCenter();

      if (this._cat) {
        // Check center position lat and lng.
        const lat = center?.lat() !== undefined ? center.lat() : position.lat;
        const lng = center?.lng() !== undefined ? center.lng() : position.lng;

        // Move the position of Chaser marker.
        if (lat !== this._chaser.lat && lng !== this._chaser.lng) {
          this._chaser.lat = lat;
          this._chaser.lng = lng;

          // Calculate distance between current Chaser position and Cat possion.
          // Update the hint message according to the distance.
          const dist = this._chaser.getDistance({ lat: this._cat.lat, lng: this._cat.lng });
          const label = document.getElementById('alertText') as HTMLElement;
          label.innerHTML = message({ dist });

          // Set street view when distance is almost zero.
          if (dist < 0.02) {
            this._pan.setPosition(new google.maps.LatLng(lat, lng));
            this._pan.setPov({ heading: 34, pitch: 10 });
            this._map?.setStreetView(this._pan);

            const markerDiv = document.getElementById('markerDiv') as HTMLElement;
            markerDiv.style.display = 'block';
            markerDiv.innerHTML = `<img src='${this._cat.image}' width='100%' height='100%' alt='' />`;
            markerDiv.onclick = () => {
              this._clearCallback?.({ img: this._cat!.image, url: this.getStreetViewLink() });
            };

            // Update street view cat marker.
            this.m_updateMarker();
          }

          // Update Chaser marker position.
          this._chaserMarker!.map = null;
          this._chaserMarker!.map = this._map;
          this._chaserMarker!.position = center;
        }
      }
    });

    // Update street view cat marker.
    this._pan.addListener('pov_changed', () => {
      this.m_updateMarker();
    });
  };

  releaseCat = () => {
    // Set boundaries where Cat can be released.
    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(53.33535320000184, -6.281728865339268),
      new google.maps.LatLng(53.35597759457463, -6.252730411329495)
    );

    // Set spinning cat image.
    const overlay: Overlay = new Overlay(bounds, 'assets/cat-spin.gif');
    overlay.setMap(this._map);

    const label = document.createElement('h1');
    label.id = 'alertText';
    label.innerHTML = 'Drag around the map';
    const div = document.createElement('div');
    div.id = 'alert';
    div.appendChild(label);

    // Hide spinning cat image.
    setTimeout(() => {
      overlay.hide();
    }, 1800);

    // Display the hint message.
    this._map?.controls[google.maps.ControlPosition.BLOCK_END_INLINE_CENTER].push(div);
  };
}
