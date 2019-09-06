import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { AppService } from './../app.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName: any;
  public lastName: any;
  public mobileNumber: any;
  public email: any;
  public password: any;
  public countryCode: any;
  public userId: any;

  constructor(  
    public appService: AppService,
    public router: Router,
    private toastr: ToastsManager,
    vcr: ViewContainerRef) {
      this.toastr.setRootViewContainerRef(vcr);
     }

  ngOnInit() {
  }

  public goToSignIn: any = () => {

    this.router.navigate(['/']);

  } // end goToSignIn

  public signupFunction: any = () => {

    if (!this.firstName) {
      this.toastr.warning('enter first name')
     

    } else if (!this.lastName) {
      this.toastr.warning('enter last name')

    } else if (!this.countryCode) {
      this.toastr.warning('enter country code')

    }else if (!this.mobileNumber) {
      this.toastr.warning('enter mobile')

    } else if (!this.email) {
      this.toastr.warning('enter email')

    } else if (!this.password) {
      this.toastr.warning('enter password')
     

    } else {

      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        countryCode: this.countryCode,
        mobileNumber: this.mobileNumber,
        email: this.email,
        password: this.password
      }

      console.log(data);



      this.appService.signupFunction(data)
        .subscribe((apiResponse) => {

          console.log(apiResponse);

          if (apiResponse.status === 200) {

            this.toastr.success('Signup successful');

            this.userId = apiResponse.data.userId;

            console.log(this.userId);

            let data = {
              userId: this.userId,
              userEvents: "[{id: 1, title: 'General Event', date: 'September 12, 2019', place: 'General Place', purpose: 'General Purpose'}]"
            }

            this.appService.eventCreateFunction(data)
              .subscribe((apiResponse) => {
                console.log(apiResponse);

                if(apiResponse.status === 200)
                {
                  console.log("Event creation is successful");
                }
                else {
                  console.log(apiResponse.message);
                }
              }, (err) => {
                console.log(err);
              });


            setTimeout(() => {

              this.goToSignIn();

            }, 2000);

          } else {

            this.toastr.error(apiResponse.message);

          }

        }, (err) => {

          this.toastr.error('some error occured');

        });

    } // end condition

  } // end signupFunction

}
