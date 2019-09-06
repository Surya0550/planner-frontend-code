import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { EventAddComponent } from './event-add/event-add.component';
import { EventShowComponent } from './event-show/event-show.component';
import { EventEditComponent } from './event-edit/event-edit.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PlannerRouteGuardService } from './planner-route-guard.service';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([
    { path: 'login', component: LoginComponent},
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'sign-up', component: SignupComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate:[PlannerRouteGuardService] },
    { path: 'dashboard-admin', component: DashboardAdminComponent, canActivate:[PlannerRouteGuardService] },
    { path: 'event-add', component: EventAddComponent, canActivate:[PlannerRouteGuardService] },
    { path: 'event-show', component: EventShowComponent, canActivate:[PlannerRouteGuardService] },
    { path: 'event-edit', component: EventEditComponent, canActivate:[PlannerRouteGuardService] },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: '**', component: NotFoundComponent }
  ])
  ],
  exports: [RouterModule],
  providers: [PlannerRouteGuardService]
})
export class AppRoutingModule { }
