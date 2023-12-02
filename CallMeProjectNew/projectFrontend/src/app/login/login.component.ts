import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketioService } from '../socketio.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email:string ="";
  password:string="";
  resultData:any;
  constructor(private router: Router, private http:HttpClient, private socketService:SocketioService){

  }


  toLogin(){

    let userData={
      email:this.email,
      password:this.password
    };

    this.http.post("http://localhost:3000/app/login", userData, {
      withCredentials:true,
        observe: "response"
    }).subscribe(res => {
      this.resultData=res;
      console.log(this.resultData);


      if(this.resultData.status){
        this.router.navigateByUrl('/home');
      }
    })



  }
}
