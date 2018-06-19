import { Component, ViewChild, OnInit } from '@angular/core';
import 'hammerjs';
import { MatMenuTrigger } from '@angular/material';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from './global.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('2000ms', style({ opacity: '*' }))
        ]),
        transition(':leave', [
          style({ opacity: '*' }),
          animate('2000ms', style({ opacity: 0 }))
        ])
      ]
    )
  ]
})
export class AppComponent implements OnInit {
  title = 'app';
  isShowLottery: boolean;
  showLoader:boolean;
  isShowDraw:boolean;
  members: string[];
  draw:string;
  token:string;

  @ViewChild (MatMenuTrigger) trigger: MatMenuTrigger;
  constructor(private global: GlobalService, private cookieService: CookieService){}

  ngOnInit() {
    this.showLoader = true;
    this.members= [];
    this.global.getMembers().subscribe(res => {
      for(let i=0; i<res.members.length ; i++) {
        this.members.push(res.members[i].last_name);
      }

      this.global.getDraw().subscribe( resDraw=> {
        this.draw = resDraw.last_name;
        this.showLoader = false;
      })
    })

    this.token = this.cookieService.get('id_token');
    if (!this.token) {
      const hashParams = window.location.hash.substr(1).split('&').reduce((acc, param) => {
        const pairs = param.split('=');
        acc[pairs[0]] = pairs[1];
        return acc;
      }, {})
      this.token = hashParams['id_token'];
      if (!this.token) {
        window.location.replace("https://auth.hadamba.com/login?response_type=token&client_id=4hiaorc0v5d7dnv1nl1fq8dbqa&redirect_uri=https://www.hadamba.com");
      } else {
        this.cookieService.set('id_token', this.token);
      }      
    }

  }

  someMethod() {
    this.trigger.openMenu();
  }
  showLottery() {
    this.isShowLottery = true;
    setTimeout(()=>{
      this.isShowLottery = false;
      this.isShowDraw = true;
    }, 5000);
  }
  
}
