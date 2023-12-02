import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketioService } from '../socketio.service';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  roomName!:string;
  username!:string;
  fullname!:string;
  roomCode!:string;

  constructor(private http:HttpClient, private router:Router, private socketService:SocketioService){

  }

 ngOnInit(): void {










 }


  onLogout(){
    this.http.get("http://localhost:3000/app/logout", {
      withCredentials:true,
        observe: "response"
    }).subscribe(res=>{
      console.log(res);

      if(res.status){
        this.router.navigateByUrl('');
      }
    })
  }

toCreateRoom(){

  this.socketService.createRoom(this.fullname);

}


  toJoinRoom(){
    this.socketService.joinRoom(this.roomCode, this.fullname);
  }


}
