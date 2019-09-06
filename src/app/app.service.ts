import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';

var userId;
var clickedUserId;
var id;

@Injectable()
export class AppService {

  private url =  'http://api.plannerapp.ml';
  

  constructor(
    public http: HttpClient
  ) {

    

  } // end constructor  

  

  public setClickedUserId = (userId) => {
    console.log(userId)
    clickedUserId = userId;
    console.log(clickedUserId)
    this.setUserId();
  }

  public setEventId = (eventId) => {
    console.log(eventId)
    id = eventId;
    console.log(id)
  }

  public getEventId = () => {
    return id;
  }

  public getUserInfoFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  } // end getUserInfoFromLocalstorage

  public setUserId = () => {

    if(Cookie.get('admin') == "1")
    {
      userId = clickedUserId;
    }
    else
    {
      userId = Cookie.get('userId')
    }
    console.log(userId);
  }


  public getUserId = () => {
    console.log(userId)
    return userId;

  }

  public setUserInfoInLocalStorage = (data) =>{

    localStorage.setItem('userInfo', JSON.stringify(data))


  }

  public signupFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('countryCode', data.countryCode)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post(`${this.url}/api/v1/users/signup`, params);

  } // end of signupFunction function.

  public eventCreateFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('userId', data.userId)
      .set('userEvents', data.userEvents);

    return this.http.post(`${this.url}/api/v1/users/event`, params);

  }

  public addEventFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('userId', data.userId)
      .set('id', data.id)
      .set('title', data.title)
      .set('date', data.date)
      .set('place', data.place)
      .set('purpose', data.purpose);

    return this.http.post(`${this.url}/api/v1/users/event/add`, params);

  } // end of signupFunction function.

  public editEventFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('title', data.title)
      .set('date', data.date)
      .set('place', data.place)
      .set('purpose', data.purpose);

    return this.http.put(this.url + '/api/v1/users/event/edit' + '/' + data.id, params);

  } // end of editEventFunction function.

  public deleteSingleEventFunction(data): Observable<any> {

    return this.http.put(this.url + '/api/v1/users/event/delete' + '/' + data.id, data);

  } // end of deleteSingleEventFunction function.

  public signinFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post(`${this.url}/api/v1/users/login`, params);
  } // end of signinFunction function.

  public getAllNormalUsersFunction(): Observable<any> {

    const params = new HttpParams()
      .set('authToken', Cookie.get('authtoken'))

    return this.http.get(`${this.url}/api/v1/users/view/all/normal`, { params });
  }

  public getSingleEventFromUsersFunction(): Observable<any> {

    const params = new HttpParams()
      .set('id', id)

    return this.http.get(`${this.url}/api/v1/users/event/single/detail`, { params });
  }

  public getSingleUserEmailId(): Observable<any> {

    //this.setUserId();

    let someId = this.getUserId();

    console.log(someId);

    const params = new HttpParams()
      .set('userId', someId);

    return this.http.get(`${this.url}/api/v1/users/email`, { params });
  }

  public sendMail(email): Observable<any> {

    //this.setUserId();

    

    const params = new HttpParams()
      .set('email', email);

    return this.http.get(`${this.url}/api/v1/users/send/email`, { params });
  }

  public logout(): Observable<any> {

    const params = new HttpParams()
      .set('authToken', Cookie.get('authtoken'))

    return this.http.post(`${this.url}/api/v1/users/logout`, params);

  } // end logout function

  

  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError

}
