import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {defaultHeaders} from "../helpers/HttpHelper";
import {MessageModel} from "../models/message-model";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private readonly http: HttpClient) {

  }

  getAll(roomId: number): Observable<MessageModel[]> {
    return this.http.get<MessageModel[]>(environment.apiDomain + '/api/chat', {
      headers: defaultHeaders,
      params: new HttpParams().set('roomId', roomId)
    });
  }
}
