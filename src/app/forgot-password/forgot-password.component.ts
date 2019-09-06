import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
//import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from './../app.service';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public email: any;

  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
  ) {

    this.toastr.setRootViewContainerRef(vcr);

  }

  ngOnInit() {
  }

  public goToSignUp: any = () => {

    this.router.navigate(['/sign-up']);

  } // end goToSignUp

  public mailFunction: any = () => {

    this.appService.sendMail(this.email)
    .subscribe((apiResponse) => {

      console.log(apiResponse)

    }, (err) => {
          console.log('some error occured')

    });

  this.toastr.success("Password sent to your Mail!");
  
  setTimeout(() => {

    this.router.navigate(['/']);

  }, 2000);

  }

}
