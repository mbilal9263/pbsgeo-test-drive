import { Component } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {Vector as VectorSource} from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorLayer} from 'ol/layer';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style';
import MultiPoint from 'ol/geom/MultiPoint';
import { Subscription } from 'rxjs';
import { MapService } from './components/map.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  map: any;
  vectorLayer: VectorLayer;
  graveyards: any[] = [];
  sub: Subscription;

  constructor(private mapService: MapService) {
    this.vectorLayer = new VectorLayer({});
    this.sub = new Subscription();
  }

  ngOnInit(): void {
    this.map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 5,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ]
    });
  }
  
  allGraveyards(event: any[]) {
    this.graveyards = event;
    this.getGravePlotsByGraveyardId(event[0].friedhofId);

  }

  getGravePlotsByGraveyardId(graveyardId: string) {
    this.sub = this.mapService.getGravePlotsByGraveyardId(graveyardId).subscribe((response) => {
      if (response) {
        this.createGraveyard(response);
      }
    }, (error) => {
      console.log(error);
    });
  }

  createGraveyard(geoJsonObject: any) {
    let styles = [
      new Style({
        stroke: new Stroke({
          color: 'blue',
          width: 1,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.3)',
        }),
      }),
      new Style({
        geometry: function (feature: any) {
          let coordinates = feature.getGeometry().getCoordinates()[0];
          return new MultiPoint(coordinates);
        },
      }) ];
      if (this.vectorLayer.getSource())
        this.vectorLayer.getSource().clear();
    let vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geoJsonObject),
    });
    this.vectorLayer = new VectorLayer({
      source: vectorSource,
      style: styles
    });
    
    this.map.addLayer(this.vectorLayer);
    this.vectorLayer.getSource().getFeatures().forEach((f: any) => {
      if (f.values_.verstorbene !== null && f.values_.verstorbene.length) {
        f.setStyle(new Style({
          stroke: new Stroke({
            color: 'green',
            width: 1,
          }),
          fill: new Fill({
            color: 'rgba(0, 255, 0, 0.3)',
          }),
        }));
      }
    });
  this.map.getView().fit(vectorSource.getExtent());
  }

  changeStyleExpireGraves () {
    this.vectorLayer.getSource().getFeatures().forEach((f: any) => {
      if (f.values_.nutzungsfristende !== null) {
        f.setStyle(new Style({
          stroke: new Stroke({
            color: 'red',
            width: 1,
          }),
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.3)',
          }),
        }));
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
