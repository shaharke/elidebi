import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RandomWordsComponent } from './random-words/random-words.component';

import { MatMenuModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';

import { CountdownTimerModule } from 'ngx-countdown-timer';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RandomWordsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MatMenuModule,
    MatIconModule,
    CountdownTimerModule.forRoot()
    
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
