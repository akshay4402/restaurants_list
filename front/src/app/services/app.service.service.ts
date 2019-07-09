import { Injectable } from '@angular/core';
import { API } from '../config/app.config';
import { HttpClient } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Injectable()
export class AppService {

  constructor( public http: HttpClient) { }

  getRestaurants() {
    return this.http.get(`${API}/getRestaurentlist`, { })
    .pipe(
    switchMap((result: Response) => {
        return of(result);
    }), catchError((e: Error) => {
      return of({type: 'ERROR', payload: e});
    }
    )
);
  }

}
