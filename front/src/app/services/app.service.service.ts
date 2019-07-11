import { Injectable } from '@angular/core';
import { API } from '../config/app.config';
import { HttpClient } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class AppService {

  constructor( public http: HttpClient) { }

  getCount() {
    return this.http.post(`${API}/count`, {})
    .pipe(
    switchMap((result: Response) => {
        return of(result);
    }), catchError((e: Error) => {
      return of({type: 'ERROR', payload: e});
    }
    )
    );
  }

  deleteRestaurants(Pval) {
    return this.http.post(`${API}/deleteRestaurent`, Pval)
    .pipe(
    switchMap((result: Response) => {
        return of(result);
    }), catchError((e: Error) => {
      return of({type: 'ERROR', payload: e});
    }
    )
    );
  }


  editRestaurentVal(Pval) {
    return this.http.post(`${API}/editRestaurent`, Pval)
    .pipe(
    switchMap((result: Response) => {
        return of(result);
    }), catchError((e: Error) => {
      return of({type: 'ERROR', payload: e});
    }
    )
    );
  }


  getRestaurants() {
    return this.http.post(`${API}/getRestaurentlist`, { })
    .pipe(
    switchMap((result: Response) => {
        return of(result);
    }), catchError((e: Error) => {
      return of({type: 'ERROR', payload: e});
    }
    )
);
  }

  saveRestaurant(pVal: Object) {
    return this.http.post(`${API}/addRestaurent`, pVal, httpOptions)
    .pipe(
    switchMap((result: Response) => {
        return of(result);
    }), catchError((e: Error) => {
      return of({type: 'ERROR', payload: e});
    }));
  }

}
