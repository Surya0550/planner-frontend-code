import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { AppService } from './../app.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';

@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.css']
})
export class EventAddComponent implements OnInit {

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


  }

  ngOnInit() {
  }

  public addEventFunction: any = () => {

    if (!this.title) {
      this.toastr.warning('enter title')
     

    } else if (!this.date) {
      this.toastr.warning('enter date')

    } else if (!this.place) {
      this.toastr.warning('enter place')

    } else if (!this.purpose) {
      this.toastr.warning('enter purpose')

    } else {

      let data = {
        userId: this.AppService.getUserId(),
        id: 1,
        title: this.title,
        date: this.date,
        place: this.place,
        purpose: this.purpose
      }

      console.log(data);

      this.AppService.addEventFunction(data)
        .subscribe((apiResponse) => {

          console.log(apiResponse);

          if (apiResponse.status === 200) {

            this.toastr.success('Event Added Successfully');

            setTimeout(() => {

              this.router.navigate(['/dashboard-admin']);

            }, 2000);

          } else {

            this.toastr.error(apiResponse.message);

          }

        }, (err) => {

          this.toastr.error('some error occured');

        });

    } // end condition

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
