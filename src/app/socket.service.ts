import { Injectable, Testability } from '@angular/core';


import * as io from 'socket.io-client';

import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import { AppService } from "./../app/app.service";

@Injectable({
  providedIn: 'root'
})


export class SocketService {

  private url = 'http://api.plannerapp.ml';

  private socket;

  public userId: any;

  constructor(public http: HttpClient, public AppService: AppService) {
    // connection is being created.
    // that handshake
    this.socket = io(this.url);
    this.userId = this.AppService.getUserId();

  }

  public verifyUser = () => {

    return Observable.create((observer) => {

      this.socket.on('verifyUser', (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end verifyUser

  public onlineUserList = () => {

    return Observable.create((observer) => {

      this.socket.on("online-user-list", (userList) => {

        observer.next(userList);

        

      }); // end Socket

    }); // end Observable

  } // end onlineUserList

  public chatByUserId = (userId) => {

    return Observable.create((observer) => {
      
      this.socket.on(userId, (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end chatByUserId

  public SendChatMessage = (chatMsgObject) => {

    this.socket.emit('chat-msg', chatMsgObject);

  }

  public msgToSelectedPersonListen = () => {

    return Observable.create((observer) => {

      this.socket.on("sendMsg", (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end function


  public disconnectedSocket = () => {

    return Observable.create((observer) => {

      this.socket.on("disconnect", () => {

        observer.next();

      }); // end Socket

    }); // end Observable



  } // end disconnectSocket

  // end events to be listened

  // events to be emitted

  public setUser = (authToken) => {

    this.socket.emit("set-user", authToken);

  } // end setUser

  public msgToSelectedPersonEmit = () => {

    let data = {
      id: this.userId,
      msg: "Test",
      name: "some name"
    }

    this.socket.emit("getMsg", data);

  } // end setUser

  public exitSocket = () =>{


    this.socket.disconnect();


  }// end exit socket




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
