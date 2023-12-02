import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { SocketioService } from '../socketio.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgForm, NgModel } from '@angular/forms';
import { ViewChild } from '@angular/core';
import Peer from 'peerjs';
import {v4 as uuidv4} from 'uuid';
import { Message } from 'models/message.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],

})
export class RoomComponent implements OnInit, AfterViewInit{

private routeSub!: Subscription;
roomId!:string;



@ViewChild('userVideo')
userVideo!:ElementRef<HTMLVideoElement>
@ViewChild('video_container')
video_container!:ElementRef<HTMLDivElement>



rtcConnectionRef!:ElementRef;
userStreamRef!:ElementRef;
hostRef!:ElementRef;

full:boolean=false;
editPeerElem:boolean=false;
peerVideo!:any;


message:Message = {
  username: '',
  text: ''
}
messages: Message[] = [];
mes: Message[] = [];
textMsg!:string;
username!:string;
usernameArray:string[]=[];
fullname!:string;
cameraOn:boolean=false;

constructor(private socketService: SocketioService, private route:ActivatedRoute, private elRef:ElementRef, private router: Router, private http: HttpClient){

}

ngOnInit(): void {
  this.routeSub=this.route.params.subscribe(params => {

    this.roomId=params['id'];
    console.log(this.roomId);
  })

  this.http.get("http://localhost:3000/app/protected-data", {
    withCredentials:true,
    observe: "response"
}).subscribe((resultData:any) =>{
    console.log(resultData.body.fullname);
    this.username=resultData.body.fullname;


  console.log('this.username', this.username);
});














}
ngAfterViewInit(): void {



  this.socketService.getMessages()
    .subscribe((message:Message) => {
      console.log(message);
      this.messages.push(message);

      console.log(this.messages);
    })



    this.socketService.makeStream(this.userVideo, this.cameraOn);
    //this.peerVideo = document.createElement('video');


    //this.video_container.nativeElement.appendChild(peerVideo);

    this.socketService.receivePeerStream(this.peerVideo, this.video_container);

    this.socketService.socket.on('ready', (event:any) =>{
      console.log('user', event.senderId, 'is ready to communicate in room', event.roomId);
      this.socketService.initiateCall(event);
    })

    this.socketService.socket.on('offer', (event:any) => {
      console.log('offer', event.offer, 'received from', event.senderId);
      this.socketService.handleReceivedOffer(event);
    })

    this.socketService.socket.on('answer', (event:any) => {
      console.log('asnwer received from', event.senderId);
      this.socketService.handleAnswer(event);
    })

    this.socketService.socket.on('ice-candidate', (event:any) => {
      const senderPeerId = event.senderId

      console.log('candidate received from', senderPeerId);
      this.socketService.handleNewIceCandidateMsg(event);
    })

    this.socketService.socket.on('leave', (event:any) => {
      console.log('user', event.peerId, 'leaves the room', event.roomId);
      this.socketService.peerLeave(event);
    })



 /* this.socketService.makeStream(this.videoStream, this.remoteVideo);
  console.log(this.videoStream);*/

}

toggleCamera(){
  if(this.socketService.userVideo){
    const tracks = (<MediaStream>this.socketService.userVideo.nativeElement.srcObject).getTracks();
    tracks.forEach((track) => {
      track.enabled = !track.enabled
    });

    this.cameraOn = !this.cameraOn;
  }
}

upadateMessage(text:string, username:string){


  this.message.text=text;
  this.message.username=username;


}

sendNewMessage(form: NgForm): void {
  console.log(this.textMsg);
  console.log(this.username);

  this.message.text=this.textMsg;
  this.message.username=this.username;
  this.socketService.sendMessage(this.message, this.roomId);

  console.log(this.messages);

  form.resetForm();
 }

leaveButton(){
  this.socketService.leaveRoom();
}


/*onClick(){
 this.videoStream.srcObject=this.socketService.stream;
  console.log(this.videoStream);

this.socketService.startStreaming();
}*/





ngOnDestroy(){

  this.routeSub.unsubscribe();
}



}
