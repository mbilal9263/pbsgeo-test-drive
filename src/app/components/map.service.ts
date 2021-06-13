import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private readonly BASE_URL = 'https://wipperfuerth.pgconnect.de/api/v1/webgis';

  constructor(private http: HttpClient) { }

  getAllGraveyard(): Observable<any> {
    let url = `${this.BASE_URL}/friedhof`;
    return this.http.get(url);
  }

  getGravesByGraveyardId(graveyardId: string): Observable<any> {
    let url = `${this.BASE_URL}/grab`;
    let params = {
      friedhofId: graveyardId
    }
    return this.http.get(url, {params});
  }

  getGravePlotsByGraveyardId(graveyardId: string): Observable<any> {
    let url = `${this.BASE_URL}/grabstelle`;
    let params = {
      friedhofId: graveyardId
    }
    return this.http.get(url, {params});
  }

  getUnassignedGravePlotsByGraveyardId(graveyardId: string): Observable<any> {
    let url = `${this.BASE_URL}/grabstelle/unverknuepft`;
    let params = {
      friedhofId: graveyardId
    }
    return this.http.get(url, {params});
  }
}
