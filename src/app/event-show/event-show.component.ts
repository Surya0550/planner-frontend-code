import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { AppService } from './../app.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { SocketService } from '../socket.service';

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

@Component({
  selector: 'app-event-show',
  templateUrl: './event-show.component.html',
  styleUrls: ['./event-show.component.css'],
  providers: [SocketService]
})
export class EventShowComponent implements OnInit {

  public userId: any;
  public id: any;
  public title: any;
  public date: any;
  public place: any;
  public purpose: any;
  public adminCheck: any;
  public disconnectedSocket: boolean;
  public messageText: any;
  public email: any;

  

  constructor(
    public AppService: AppService,
    public SocketService: SocketService,
    public router: Router,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
  ) {

   
    
    this.toastr.setRootViewContainerRef(vcr);
    this.id = this.AppService.getEventId();


  }

  ngOnInit() {
    this.getSingleEventFunction();
    this.getSingleUserEmailIdFunction();
  }

  

  public getSingleEventFunction: any = () => {

    

      this.AppService.getSingleEventFromUsersFunction()
        .subscribe((apiResponse) => {

          console.log(apiResponse);

          this.id = apiResponse.id;
          this.title = apiResponse.title;
          this.date = apiResponse.date;
          this.place = apiResponse.place;
          this.purpose = apiResponse.purpose;

          if(Cookie.get('admin') == '1'){
            this.adminCheck = true;
          }


        }, (err) => {

          this.toastr.error('some error occured');

        });

  } // end getSingleEventFunction

  public getSingleUserEmailIdFunction: any = () => {

    

    this.AppService.getSingleUserEmailId()
      .subscribe((apiResponse) => {

        console.log(apiResponse);

        this.email = apiResponse.email;

      }, (err) => {

        this.toastr.error('some error occured');

      });

} // end getSingleUserEmailIdFunction

  public goToEdit: any = () => {
    var id = this.AppService.getUserId();
    this.messageText = "I have edited an event for you";
    sleep(5000).then(() => {
      this.sendMessage(id);
    }) 
    this.router.navigate(['/event-edit']);
  }

  public sendMessage: any = (userId) => {

    console.log(this.email);

    if(this.messageText){

      let chatMsgObject = {
        
        id: userId,
        message: this.messageText,
        email: this.email,
        created: 0,
        edited: 1,
        sub: "Calendar App: Change Alert",
        msg: "Admin has changed an event for you"
        //createdOn: new Date()
      } // end chatMsgObject
      console.log(chatMsgObject);
      this.SocketService.SendChatMessage(chatMsgObject)
      //this.pushToChatWindow(chatMsgObject)
      

    }
    else{
      this.toastr.warning('text message can not be empty')

    }

  } // end sendMessage
  
  public deleteSingleEventFunction: any = () => {

    let data = {
      id: this.id
    }

    console.log(data);

    this.AppService.deleteSingleEventFunction(data)
      .subscribe((apiResponse) => {

        console.log(apiResponse);

        if (apiResponse.status === 200) {

          this.toastr.success('Event Deleted Successfully');

          setTimeout(() => {

            this.router.navigate(['/dashboard-admin']);

          }, 2000);

        } else {

          this.toastr.error(apiResponse.message);

        }

      }, (err) => {

        this.toastr.error('some error occured');

      });

} // end addEventFunction

  public logout: any = () => {

    this.AppService.logout()
      .subscribe((apiResponse) => {
  
        if (apiResponse.status === 200) {
          console.log("logout called")
          Cookie.delete('authtoken');
  
          Cookie.delete('receiverId');
  
          Cookie.delete('receiverName');

          Cookie.delete('userId');

          Cookie.delete('admin');
  
          this.router.navigate(['/']);
  
        } else {
          this.toastr.error(apiResponse.message)
  
        } // end condition
  
      }, (err) => {
        this.toastr.error('some error occured')
  
  
      });
  
  }

}
