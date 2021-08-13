import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {RoomModel} from "../models/room-model";
import {httpOptions} from "../helpers/HttpHelper";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private readonly http: HttpClient) {

  }

  getAll(): Observable<RoomModel[]> {
    return this.http.get<RoomModel[]>(environment.apiDomain + '/api/room', httpOptions);
  }

  create(room: RoomModel): Observable<RoomModel> {
    return this.http.post<RoomModel>(environment.apiDomain + '/api/room', room, httpOptions);
  }
}
