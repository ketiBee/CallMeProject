import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { async } from 'rxjs';
import { AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { SocketioService } from './socketio.service';

const mediaConstraints = {
  audio:true,
  video: {width:720, height: 540}
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
title='callMeProject'

  constructor(private socketService: SocketioService){}

ngOnInit(): void {
  this.socketService.setupSocketConnection();
}
ngOnDestory(){
  this.socketService.disconnect();
}

}
