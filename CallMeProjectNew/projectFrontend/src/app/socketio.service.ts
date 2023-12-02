import { ElementRef, Injectable, OnInit } from '@angular/core';
import { enviroment } from 'src/enviroment';
import { io } from 'socket.io-client';
import { Route, Router } from '@angular/router';
import { Peer} from 'peerjs';
import {v4 as uuidv4} from 'uuid';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from 'models/message.model';



@Injectable({
  providedIn: 'root'
})
export class SocketioService {


  socket:any;
  data:any;
  user!:Peer;
  userId!:any;
  resultData!:any;
  filterUsers!:any;
  userDeleteId!:any;
  deletedUser!:any;

  stream!:MediaStream;
  userVideo!:ElementRef<HTMLVideoElement>
  peerVideo!:any;
  userStreamRef!:MediaStream;
  hostRef!:boolean;
  roomId!:any;

  editElem!:boolean;

  localPeerId:any;
  remotePeerId:any;
  peerConnections:Record <string, any> = {};
  rtcConnection!:any;
  video_container!:ElementRef<HTMLElement>
  otherRemotePeerId!:any;

  username!:string;
  usernameArray:string []=[];
  userList:string[]=[];
  fullname!:string;
  fullnameP!:any;



  configuration : RTCConfiguration = {
    iceServers: [
      {
        urls:[
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302'
        ]
      }
    ]

  }

  constructor(private router:Router, private http:HttpClient){

  }

  setupSocketConnection(){
    this.socket=io(enviroment.SOCKET_ENDPOINT);


  }



  createRTCConnection(){
    this.rtcConnection=new RTCPeerConnection(this.configuration);

    //this.rtcConnection.onicecandidate=this.handleICECandidate;

    //this.rtcConnection.ontrack=this.handleTrackEvenet;

  }
  receivePeerStream(peerVideo:any, video_container:ElementRef){

    this.peerVideo=peerVideo;

    this.video_container=video_container;



  }



  makeStream(userStream:ElementRef, cameraOn:boolean){

    if(this.hostRef== true){
     navigator.mediaDevices.getUserMedia({video:true, audio:true})
     .then((stream) => {
        this.userVideo=userStream;
        //console.log(stream);
        this.userStreamRef=stream;
        //console.log('userStreamRef', this.userStreamRef)
        //userStream.nativeElement.srcObject=stream;
        this.userVideo.nativeElement.srcObject=stream;
        cameraOn=true;



      })
      .catch((err) => {
        console.log(err);
       })
    }
    else{
      navigator.mediaDevices.getUserMedia({video:true, audio:true})
      .then((stream) => {
        this.userVideo=userStream;
        //console.log(stream);
        this.userStreamRef=stream;
        this.userVideo.nativeElement.srcObject=stream;


        this.socket.emit('ready', {roomId:this.roomId, senderId:this.localPeerId});
       })
       .catch((err) => {
        console.log(err);
       })
    }



  }

  initiateCall(event:any){

    this.remotePeerId=event.senderId;
    console.log('Initiate call received from remotePeerId', this.remotePeerId);



      this.peerConnections[this.remotePeerId]=new RTCPeerConnection(this.configuration);
      console.log('peer connections', this.peerConnections);

      this.userStreamRef.getTracks().forEach((track) => {
        this.peerConnections[this.remotePeerId].addTrack(track, this.userStreamRef);
      })

      this.peerConnections[this.remotePeerId].ontrack = (event:any) => this.handleTrackEvenet(event, this.remotePeerId);
      this.peerConnections[this.remotePeerId].onicecandidate = (event:any) => this.handleICECandidate(event, this.remotePeerId);
      //this.peerConnections[this.remotePeerId].oniceconnectionstatechange = (event:any) => this.checkDisconnet(event, this.remotePeerId);


      this.peerConnections[this.remotePeerId].createOffer()
      .then((offer:any) => {
        this.peerConnections[this.remotePeerId].setLocalDescription(offer);
        console.log('sending offer from peer', this.localPeerId, 'to peer', this.remotePeerId)
        this.socket.emit('offer', {
          offer: offer,
          roomId:this.roomId,
          senderId:this.localPeerId,
          receiverId:this.remotePeerId

        });
      })
      .catch((error:any) => {
        console.log(error)
      })






      // this.createRTCConnection();
      // console.log('rtc conn', this.rtcConnection);
      // console.log('userstream', this.userStreamRef);
      // this.rtcConnection.addTrack(

      //   this.userStreamRef.getTracks()[0],
      //   this.userStreamRef
      // )
      // this.rtcConnection.addTrack(
      //   this.userStreamRef.getTracks()[1],
      //   this.userStreamRef
      // )
      // this.rtcConnection.createOffer()
      // .then((offer:any) => {
      //   this.rtcConnection.setLocalDescription(offer);
      //   this.socket.emit('offer', offer, this.roomId);
      // })
      // .catch((error:any) => {
      //   console.log(error)
      // })

  }

  handleReceivedOffer(event:any){

      const remotePeerId= event.senderId;

      this.peerConnections[remotePeerId] = new RTCPeerConnection(this.configuration);


      console.log(new RTCSessionDescription(event.offer));
      this.peerConnections[remotePeerId].setRemoteDescription(new RTCSessionDescription(event.offer));

      console.log('remote description set on peer', this.localPeerId, 'after offer received');

      this.userStreamRef.getTracks().forEach((track) => {
        this.peerConnections[remotePeerId].addTrack(track, this.userStreamRef);
      })

      this.peerConnections[remotePeerId].ontrack = (event:any) => this.handleTrackEvenet(event, remotePeerId);
      this.peerConnections[remotePeerId].onicecandidate = (event:any) => this.handleICECandidate(event, remotePeerId);
      //this.peerConnections[remotePeerId].oniceconnectionstatechange = (event:any) => this.checkDisconnet(event, remotePeerId);

      this.peerConnections[remotePeerId].createAnswer()
      .then((answer:any) => {
        this.peerConnections[remotePeerId].setLocalDescription(answer);

        console.log('sending answer from peer', this.localPeerId, 'to peer', remotePeerId);
        this.socket.emit('answer', {
          answer:answer,
          roomId: this.roomId,
          senderId:this.localPeerId,
          receiverId: remotePeerId
        });
      })
      .catch((error:any) => {
        console.log(error);
      })

      // this.createRTCConnection();
      // this.rtcConnection.addTrack(
      //   this.userStreamRef.getTracks()[0],
      //   this.userStreamRef
      // )
      // this.rtcConnection.addTrack(
      //   this.userStreamRef.getTracks()[1],
      //   this.userStreamRef
      // )

      // this.rtcConnection.setRemoteDescription(offer);
      // console.log('handle offer', this.rtcConnection);

      // this.rtcConnection.createAnswer()
      // .then((answer:any) => {
      //   this.rtcConnection.setLocalDescription(answer);
      //   this.socket.emit('answer', answer, this.roomId);
      // })
      // .catch((error:any) => {
      //   console.log(error);
      // })

  }

  handleAnswer(event:any){

    this.peerConnections[event.senderId].setRemoteDescription(new RTCSessionDescription(event.answer));

    console.log('rtcDescription answer', new RTCSessionDescription(event.answer));


  }

  handleICECandidate = (event:any, remotePeerId:any) => {
    if(event.candidate){
      console.log("sending ICE candidate from", this.localPeerId, "tp peer", remotePeerId);
      this.socket.emit('ice-candidate', {
        senderId: this.localPeerId,
        receiverId: remotePeerId,
        roomId: this.roomId,
        label: event.candidate.sdpMLineIndex,
        candidate: event.candidate.candidate
      });
    }

  }

  handleNewIceCandidateMsg(event:any){
    const candidate= new RTCIceCandidate({
      sdpMLineIndex: event.label,
      candidate: event.candidate
    });
    this.peerConnections[event.senderId].addIceCandidate(candidate)
    .catch((error:any) => {
      console.log(error);
    })


  }

  handleTrackEvenet = (event:any, remotePeerId:any) => {

    console.log('remotePeerId', remotePeerId);
    if(event.track.kind == "video"){
      //console.log('handle peerVideo', this.peerVideo);
      //console.log('handle event.streams', event.streams[0])
      this.peerVideo=document.createElement('video');
      this.peerVideo.srcObject = event.streams[0];
      this.peerVideo.id='remotevideo'+remotePeerId;
      this.peerVideo.setAttribute('autoplay', '');
      this.video_container.nativeElement.appendChild(this.peerVideo);


      //console.log('handle video_container', this.video_container);
    }
  }

  checkDisconnet(event:any, remotePeerId:any){
    console.log('check', this.peerConnections);

    var state = this.peerConnections[remotePeerId].iceConnectionState;
    console.log("connection with peer", remotePeerId, ":", state);


    if(state === "failed" || state === "closed" || state ==="disconnected")
    {
      console.log("Peer", remotePeerId, "has disconnected");
      this.peerConnections[remotePeerId].ontrack=null;
      this.peerConnections[remotePeerId].onicecandidate=null;

      const videoDisconnected = document.getElementById('remotevideo'+remotePeerId);
      videoDisconnected?.remove();

    }
  }


  leaveRoom(){
    this.socket.emit('leave', {roomId:this.roomId, peerId:this.socket.id});
    this.router.navigate(['home']);

    if(this.userVideo.nativeElement.srcObject){
      (<MediaStream>this.userVideo.nativeElement.srcObject).getTracks().forEach((track) => track.stop())
    }

    // if(this.peerVideo.srcObject){
    //   this.peerVideo.srcObject.getTracks().forEach((track:any) => track.stop())
    // }




  }

  peerLeave(event:any){
    this.peerConnections[event.peerId].ontrack=null;
    this.peerConnections[event.peerId].onicecandidate=null;
    this.peerConnections[event.peerId].close();
    this.peerConnections[event.peerId]=null;

    console.log('peerConnections', this.peerConnections);
      const videoDisconnected = document.getElementById('remotevideo'+ event.peerId);
      videoDisconnected?.remove();
  }








  createRoom(fullname:string){

    this.fullname=fullname;
    this.socket.emit('create-room', this.fullname);



    this.socket.on('room-created', (event:any) => {

      this.roomId=event.roomId;

      this.localPeerId=event.peerId;
      console.log('locala perr id', this.localPeerId);

      this.router.navigate(['/room', event.roomId]);

      this.hostRef=true;


    })




  }

  joinRoom(roomId:any, fullname:string){

    this.fullname=fullname;

    console.log('local peer id', this.socket.id);
    this.localPeerId=this.socket.id

    this.socket.emit('join-room', {roomId: roomId, peerId:this.localPeerId, username:this.fullname, userList:this.userList});
    console.log('user', this.localPeerId, 'joined room', roomId);



    this.router.navigate(['/room', roomId]);
    this.roomId=roomId;



  }


  //CHAT IMPLEMENTATION

  sendMessage(message:Message, roomId:any){

    this.socket.emit('new-message', {message:message, roomId:roomId})

  }

  getMessages = () => {
    return Observable.create((observer:any) => {
      this.socket.on('new-message', (message:Message) => {
        console.log('getMessages', message);
        observer.next(message);
      })
    })
  }





  disconnect(){
    if(this.socket) {

    this.socket.disconnect();
    }
  }




}


