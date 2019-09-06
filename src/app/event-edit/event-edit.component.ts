import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { AppService } from './../app.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {

  public userId: any;
  public id: any;
  public title: any;
  public date: any;
  public place: any;
  public purpose: any;

  constructor(
    public AppService: AppService,
    public router: Router,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
  ) {

   
    
    this.toastr.setRootViewContainerRef(vcr);
    this.id = this.AppService.getEventId();


  }

  ngOnInit() {
    this.getSingleEventFunction();
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
      }, (err) => {

        this.toastr.error('some error occured');

      });

} // end addEventFunction


  public editEventFunction: any = () => {

      let data = {
        id: this.id,
        title: this.title,
        date: this.date,
        place: this.place,
        purpose: this.purpose
      }

      console.log(data);

      this.AppService.editEventFunction(data)
        .subscribe((apiResponse) => {

          console.log(apiResponse);

          if (apiResponse.status === 200) {

            this.toastr.success('Event Edited Successfully');

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
