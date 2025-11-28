import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ManagercreatesavingsplanComponent } from './components/managercreatesavingsplan/managercreatesavingsplan.component';
import { ManagerviewsavingsplanComponent } from './components/managerviewsavingsplan/managerviewsavingsplan.component';
import { ManagereditsavingsplanComponent } from './components/managereditsavingsplan/managereditsavingsplan.component';
import { HomeComponent } from './components/home/home.component';
import { ManagernavComponent } from './components/managernav/managernav.component';
import { ManagerviewfeedbackComponent } from './components/managerviewfeedback/managerviewfeedback.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UsernavComponent } from './components/usernav/usernav.component';
import { UserplanapplicationformComponent } from './components/userplanapplicationform/userplanapplicationform.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { ErrorComponent } from './components/error/error.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { UserviewsavingsplanComponent } from './components/userviewsavingsplan/userviewsavingsplan.component';
import { UserappliedplansComponent } from './components/userappliedplans/userappliedplans.component';
import { ManagerviewapplicationformComponent } from './components/managerviewapplicationform/managerviewapplicationform.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { LoaderComponent } from './components/loader/loader.component';
//import { LandingPageComponent } from './components/landingpage/landingpage.component';




@NgModule({
  declarations: [
    AppComponent,
    UseraddfeedbackComponent,
    ManagercreatesavingsplanComponent,
    ManagerviewsavingsplanComponent,
    ManagereditsavingsplanComponent,
    HomeComponent,
    ManagernavComponent,
    ManagerviewfeedbackComponent,
    NavbarComponent,
    UseraddfeedbackComponent,
    UsernavComponent,
    UserplanapplicationformComponent,
    UserviewfeedbackComponent,
    ErrorComponent,
    LoginComponent,
    RegistrationComponent,
    UserviewsavingsplanComponent,
    UserplanapplicationformComponent,
    UserappliedplansComponent,
    ManagerviewapplicationformComponent,
    LandingPageComponent,
    ManagerDashboardComponent,
    LoaderComponent,
   
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
