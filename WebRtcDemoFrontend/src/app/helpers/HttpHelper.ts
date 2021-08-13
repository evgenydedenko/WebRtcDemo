import {HttpHeaders} from "@angular/common/http";

export const defaultHeaders = new HttpHeaders({
  'Content-Type':  'application/json'
});

export const httpOptions = {
  headers: defaultHeaders
};
