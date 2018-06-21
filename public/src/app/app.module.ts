import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RandomWordsComponent } from './random-words/random-words.component';

import { MatMenuModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';

import { CountdownTimerModule } from 'ngx-countdown-timer';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';



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
    RouterModule.forRoot([]),
    MatMenuModule,
    MatIconModule,
    CountdownTimerModule.forRoot(),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
    
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
