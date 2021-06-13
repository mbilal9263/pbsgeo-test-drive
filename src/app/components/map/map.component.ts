import { Component, OnInit, ChangeDetectionStrategy, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import Map from 'ol/Map';
import { Subscription } from 'rxjs';
import { MapService } from '../map.service';


@Component({
  selector: 'app-map',
  template: ``,
  styles: [':host { width: 100%; height: 100%; display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit {
  @Input() map: Map = new Map({});
  @Output() graveYards: EventEmitter<any[]>;
  sub: Subscription;

  constructor(private elementRef: ElementRef, private mapService: MapService) {
    this.graveYards = new EventEmitter<any[]>();
    this.sub = new Subscription();
  }

  ngOnInit(): void {
    this.map.setTarget(this.elementRef.nativeElement);
    this.fetchGraveyards();
  }

  fetchGraveyards() {
    this.sub = this.mapService.getAllGraveyard().subscribe((response) => {
      if (response) {
        this.graveYards.emit(response);
      }
    }, (error) => {
      console.log(error);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
