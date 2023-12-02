import { Component, OnInit } from '@angular/core';
import { SocketioService } from '../socketio.service';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { Peer } from 'peerjs';
import {v4 as uuidv4} from 'uuid';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css']
})
export class JoinRoomComponent implements OnInit{


  roomCode!:any;
  user!:Peer;
  full:boolean=false;
  username!:string;
  fullname!:string;

constructor(private socketService: SocketioService, private router:Router, private http: HttpClient){

}

ngOnInit(): void {

  this.http.get("http://localhost:3000/app/protected-data", {
    withCredentials:true,
    observe: "response"
}).subscribe((resultData:any) =>{
    console.log(resultData.body.fullname);
    this.fullname=resultData.body.fullname;



});



}



onClick() {
  console.log(this.roomCode);


    this.socketService.joinRoom(this.roomCode, this.fullname);



}


}
