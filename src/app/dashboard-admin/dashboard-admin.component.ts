import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { AppService } from './../app.service';
import { SocketService } from './../socket.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
  providers: [SocketService]
})



export class DashboardAdminComponent implements OnInit {

  public Userlist;
  public authToken: any;
  public userInfo: any;
  public userList: any = [];
  public disconnectedSocket: boolean;
  public receiverId: any;
  public receiverName: any;
  public messageText: any;
  public email: any;

  user: Observable<Array<any>>

  

  constructor(
    public AppService: AppService,
    public SocketService: SocketService,
    public router: Router,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
  ) {

   
    
    this.toastr.setRootViewContainerRef(vcr);


  }

  ngOnInit() {

    this.authToken = Cookie.get('authtoken');

    this.userInfo = this.AppService.getUserInfoFromLocalstorage();

    this.receiverId = Cookie.get("receiverId");

    this.receiverName =  Cookie.get('receiverName');

    console.log(this.receiverId,this.receiverName)

    //this.checkStatus();
    this.verifyUserConfirmation();
    this.getOnlineUserList();

    this.getUsersFunction();
    
  }

  

  public getUsersFunction: any = () => {
    this.AppService.getAllNormalUsersFunction().subscribe((apiResponse) => {
      console.log(apiResponse)
      if (apiResponse.status === 200) {

      this.Userlist = apiResponse.data;
      } else { this.toastr.error(apiResponse.message); console.log(apiResponse.message)}

    }, (err) => {
      this.toastr.error('some error occured')
    })
  }

  public getSingleUserEmailIdFunction: any = () => {

    

    this.AppService.getSingleUserEmailId()
      .subscribe((apiResponse) => {

        console.log(apiResponse);

        this.email = apiResponse.email;

        console.log(this.email);

      }, (err) => {

        console.log(err);
        this.toastr.error('some error occured');

      });

} // end getSingleUserEmailIdFunction

  public goToUserDashboard: any = (userId) => {
    this.AppService.setClickedUserId(userId);
    this.router.navigate(['/dashboard']);
  }

  public goToCreatePage: any = (userId) => {
    this.AppService.setClickedUserId(userId);
    this.getSingleUserEmailIdFunction();
    this.messageText = "I have created an event for you";
    sleep(5000).then(() => {
      this.sendMessage(userId);
    }) 
    //this.SocketService.msgToSelectedPersonEmit();
    this.router.navigate(['/event-add']);
  }

  public sendMessage: any = (userId) => {

    console.log(this.email);

    if(this.messageText){

      let chatMsgObject = {
        
        id: userId,
        message: this.messageText,
        created: 1,
        edited: 0,
        email: this.email,
        sub: "Calendar App: Create Alert",
        msg: "Admin has created an event for you"

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

  public checkStatus: any = () => {

    if (Cookie.get('authtoken') === undefined || Cookie.get('authtoken') === '' || Cookie.get('authtoken') === null) {

      this.router.navigate(['/']);

      return false;

    } else {

      return true;

    }

  } // end checkStatus



  public verifyUserConfirmation: any = () => {

    this.SocketService.verifyUser()
      .subscribe((data) => {

        this.disconnectedSocket = false;

        this.SocketService.setUser(this.authToken);

      });
    }
  
  public getOnlineUserList :any =()=>{

    this.SocketService.onlineUserList()
      .subscribe((userList) => {

        this.userList = [];

        for (let x in userList) {

          let temp = { 'userId': x, 'name': userList[x], 'unread': 0, 'chatting': false };

          this.userList.push(temp);          

        }
        
        console.log(this.userList);

      }); // end online-user-list
  }

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
