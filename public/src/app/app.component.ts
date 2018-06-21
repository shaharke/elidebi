import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import 'hammerjs';
import { MatMenuTrigger } from '@angular/material';
import { GlobalService } from './global.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ActivatedRoute, Params } from "@angular/router";
import { componentDestroyed } from "./componentDestroyed";
import { CookieService } from 'ngx-cookie-service';

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
          animate('10ms', style({ opacity: 0 }))
        ])
      ]
    )
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  isShowLottery: boolean;
  showLoader:boolean;
  isShowDraw:boolean;
  members: string[];
  draw:string;
  params:Params;
  counter = 0;
  showEgg:boolean;
  isClickEggOnce:boolean;
  timeOutObj;
  token:string;
  @ViewChild (MatMenuTrigger) trigger: MatMenuTrigger;
  
  constructor(private global: GlobalService, 
    private route: ActivatedRoute, private cookieService: CookieService){
    this.route.queryParams.subscribe(this.onRouteChanged.bind(this));
  }


  ngOnInit() {
    this.showLoader = true;
    this.members= [];
    this.global.getMembers().subscribe(res => {
      for(let i=0; i<res.members.length ; i++) {
        this.members.push(res.members[i].nickname);
      }
      this.global.getDraw().subscribe( resDraw=> {
        this.draw = resDraw.first_name + ' ' + resDraw.last_name;
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
        window.location.replace("https://auth.hadamba.com/login?response_type=token&client_id=4hiaorc0v5d7dnv1nl1fq8dbqa&redirect_uri=http://localhost:4200");
      } else {
        this.cookieService.set('id_token', this.token);
      }
    }
  }
  ngOnDestroy(){}

  onRouteChanged(params: Params) {
    this.params = params;
    if (this.params && this.params['id_token']) {
      this.token = this.params['id_token'];
      console.log("token", this.token);
      
    }
  }

  someMethod() {
    this.trigger.openMenu();
  }
  showLottery() {
    this.showEgg = false;
    this.isShowDraw = false;
    this.isShowLottery = true;
    setTimeout(()=>{
      this.isShowLottery = false;
      this.isShowDraw = true;
    }, 5000);
  }
  clickCounter() {
    if (!this.isClickEggOnce) {
      this.isClickEggOnce = true;
      this.timeOutObj = setTimeout(()=>{
        this.resetEggTimer();
      }, 3000)
    }
    this.counter += 1;
    if (this.counter > 4) {
      this.showEgg = true;
      console.log("egg");
      
    }
  }
  resetEggTimer(){
    this.isClickEggOnce = false;
    this.counter = 0;
      
  }
}
