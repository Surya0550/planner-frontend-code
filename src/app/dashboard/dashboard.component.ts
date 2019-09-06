import { Component, ChangeDetectionStrategy, TemplateRef, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { AppService } from './../app.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from './../socket.service';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  addHours,
  format
} from 'date-fns';
import { Subject, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

interface Dummy {
  id: number;
  title: string;
  date: string;
  place: string;
  purpose: string;
}

var userId;

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [SocketService]
})
export class DashboardComponent implements OnInit {

  public authToken: any;
  public userInfo: any;
  public userList: any = [];
  public disconnectedSocket: boolean;
  public receiverId: any;
  public receiverName: any;


  constructor(
    public AppService: AppService,
    public SocketService: SocketService,
    public router: Router,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private modal: NgbModal,
    private http: HttpClient
  ) {

   
    
    this.toastr.setRootViewContainerRef(vcr);




  }


  view: string = 'month';

  viewDate: Date = new Date();

  events$: Observable<Array<CalendarEvent<{ dummy: Dummy }>>>;

  activeDayIsOpen: boolean = false;


  ngOnInit(): void {

    this.authToken = Cookie.get('authtoken');

    this.userInfo = this.AppService.getUserInfoFromLocalstorage();

    this.receiverId = Cookie.get("receiverId");

    this.receiverName =  Cookie.get('receiverName');

    console.log(this.receiverId,this.receiverName)

    //this.checkStatus();

    this.verifyUserConfirmation();
    this.getOnlineUserList();
    this.getMessageFromAUser();

    this.AppService.setUserId();
    userId = this.AppService.getUserId();
    console.log(userId)
    this.fetchEvents();
  }

  fetchEvents(): void {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay
    }[this.view];

    const params = new HttpParams()
      .set(
        'userId',
        userId
      );


      this.events$ = this.http
      .get('http://api.plannerapp.ml/api/v1/users/event/detail', { params })
      .pipe(
        map(({ userEvents }: { userEvents: Dummy[] }) => {
          //if(!userEvents){alert("User Events are not created, Please create/add through admin."); return}
          return userEvents.map((dummy: Dummy) => {
            console.log(dummy);
            console.log(dummy.title);
            return {
              title: dummy.title,
              start: new Date(
                dummy.date
              ),
              color: colors.yellow,
              allDay: true,
              meta: {
                dummy
              }
            };
          });
        })
      );
  }

  dayClicked({
    date,
    events
  }: {
    date: Date;
    events: Array<CalendarEvent<{ dummy: Dummy }>>;
  }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventClicked(event: CalendarEvent<{ dummy: Dummy }>): void {
    console.log(event.meta.dummy.id);
    this.AppService.setEventId(event.meta.dummy.id);
    this.router.navigate(['/event-show']);
  }

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

    public receiveMsg: any = () => {

      this.SocketService.msgToSelectedPersonListen()
        .subscribe((data) => {
  
          this.disconnectedSocket = false;
  
          console.log(data);
  
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

  public getMessageFromAUser :any =()=>{

    this.SocketService.chatByUserId(Cookie.get('userId'))
    .subscribe((data)=>{
     

      //(Cookie.get('userId')==data.id)?alert(data):'';

      this.toastr.success(`Admin says : ${data.message}`)

      //this.scrollToChatTop=false;

    });//end subscribe

}// end get message from a user 

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

          this.SocketService.exitSocket()
  
          this.router.navigate(['/']);
  
        } else {
          this.toastr.error(apiResponse.message)
  
        } // end condition
  
      }, (err) => {
        this.toastr.error('some error occured')
  
  
      });
  
  }
}