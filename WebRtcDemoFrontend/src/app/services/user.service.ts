import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {UserModel} from "../models/user-model";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {httpOptions} from "../helpers/HttpHelper";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly http: HttpClient) {

  }

  getOrInsert(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(environment.apiDomain + '/api/user', user, httpOptions);
  }
}
