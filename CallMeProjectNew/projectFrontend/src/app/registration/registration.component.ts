import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  fullname:string="";
  email:string="";
  password:string="";

  constructor(private http: HttpClient, private router: Router){

  }

  toRegister(){
    let userData = {
      "fullname":this.fullname,
      "email":this.email,
      "password":this.password,
    };

    console.log(userData);

    this.http.post("http://localhost:3000/app/register", userData, {
      withCredentials:true,
      observe: "response"
    }).subscribe((resultData:any) =>{
      console.log(resultData);


      if(resultData.status){
        this.router.navigateByUrl('/login');
      }
    });
  }

  toSave(){
      this.toRegister();
  }
}
