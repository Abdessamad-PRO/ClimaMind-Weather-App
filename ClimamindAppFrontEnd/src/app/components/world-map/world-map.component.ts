import {
  Component, Output, EventEmitter,
  ViewChild, ElementRef, AfterViewInit, Input,
  OnChanges, SimpleChanges, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapPin } from '../../core/models/location.model';
import * as L from 'leaflet';

export type MapStyle = 'simple' | 'relief' | 'satellite';

@Component({
  selector: 'app-world-map',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss']
})
export class WorldMapComponent implements AfterViewInit, OnChanges {
  @Input() pins: MapPin[] = [];
  @Input() currentLat = 0;
  @Input() currentLon = 0;
  @Input() loading = false;

  @Output() onLocationSelect = new EventEmitter<{ lat: number; lon: number }>();

  @ViewChild('mapElement') mapElement!: ElementRef<HTMLDivElement>;

  private map!: L.Map;
  private currentMarker?: L.Marker;
  private pinsLayerGroup: L.LayerGroup = L.layerGroup();

  currentStyle: MapStyle = 'simple';
  private currentTileLayer!: L.TileLayer;

  // Définition des 3 tuiles de fonds de carte
  private tileLayers = {
    simple: L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }),
    relief: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: '&copy; OpenStreetMap contributors, SRTM | &copy; OpenTopoMap'
    }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    })
  };

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) return;

    if (changes['currentLat'] || changes['currentLon']) {
      this.updateCurrentLocationPin(this.currentLat, this.currentLon);
    }

    if (changes['pins']) {
      this.updatePins();
    }
  }

  private initMap(): void {
    const lat = this.currentLat || 20;
    const lon = this.currentLon || 0;
    const zoom = this.currentLat ? 6 : 2;

    // 1. Initialisation de la carte Leaflet
    this.map = L.map(this.mapElement.nativeElement, {
      center: [lat, lon],
      zoom: zoom,
      zoomControl: true
    });

    // 2. Chargement du mode de carte par défaut (Simple)
    this.currentTileLayer = this.tileLayers[this.currentStyle];
    this.currentTileLayer.addTo(this.map);

    this.pinsLayerGroup.addTo(this.map);

    // 3. Événement clic
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.onLocationSelect.emit({
        lat: e.latlng.lat,
        lon: e.latlng.lng
      });
    });

    if (this.currentLat && this.currentLon) {
      this.updateCurrentLocationPin(this.currentLat, this.currentLon);
    }

    this.updatePins();

    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  // Changement dynamique du fond de carte
  changeMapStyle(style: MapStyle): void {
    if (this.currentStyle === style || !this.map) return;

    if (this.currentTileLayer) {
      this.map.removeLayer(this.currentTileLayer);
    }

    this.currentStyle = style;
    this.currentTileLayer = this.tileLayers[style];
    this.currentTileLayer.addTo(this.map);
  }

  private updateCurrentLocationPin(lat: number, lon: number): void {
    if (!lat && !lon) return;

    const currentIcon = L.divIcon({
      className: 'custom-current-pin',
      html: `<div style="width:16px;height:16px;background:#fbbf24;border:2px solid #ffffff;border-radius:50%;box-shadow:0 0 10px #fbbf24;"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    if (this.currentMarker) {
      this.currentMarker.setLatLng([lat, lon]);
    } else {
      this.currentMarker = L.marker([lat, lon], { icon: currentIcon }).addTo(this.map);
    }

    this.map.setView([lat, lon], Math.max(this.map.getZoom(), 5), { animate: true });
  }

  private updatePins(): void {
    if (!this.map) return;
    this.pinsLayerGroup.clearLayers();

    this.pins.forEach(pin => {
      const pinIcon = L.divIcon({
        className: 'custom-pin',
        html: `
          <div style="display:flex;align-items:center;gap:6px;background:rgba(15,23,42,0.85);padding:3px 8px;border-radius:12px;border:1px solid #93c5fd;color:#fff;font-size:11px;white-space:nowrap;">
            <span style="width:8px;height:8px;background:#93c5fd;border-radius:50%;"></span>
            <span>${pin.city || ''} ${pin.temperature ? pin.temperature + '°' : ''}</span>
          </div>
        `,
        iconSize: [100, 24],
        iconAnchor: [12, 12]
      });

      L.marker([pin.lat, pin.lon], { icon: pinIcon }).addTo(this.pinsLayerGroup);
    });
  }
}