import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {RoomModel} from "../models/room-model";
import {defaultHeaders, httpOptions} from "../helpers/HttpHelper";
import {MessageModel} from "../models/message-model";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private readonly http: HttpClient) {

  }

  getAll(): Observable<RoomModel[]> {
    return this.http.get<RoomModel[]>(environment.apiDomain + '/api/room', httpOptions);
  }

  search(userId: number, userName: string): Observable<number> {
    return this.http.get<number>(environment.apiDomain + '/api/room/search', {
      headers: defaultHeaders,
      params: new HttpParams()
        .set('userId', userId)
        .set('userName', userName)
    });
  }

  create(room: RoomModel): Observable<RoomModel> {
    return this.http.post<RoomModel>(environment.apiDomain + '/api/room', room, httpOptions);
  }
}
