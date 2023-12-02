import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { FirstpageComponent } from './firstpage/firstpage.component';
import { RoomComponent } from './room/room.component';

import { JoinRoomComponent } from './join-room/join-room.component';

const routes: Routes = [
  {
    path:'',
    component: FirstpageComponent
  },

  {
    path:'register',
    component: RegistrationComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'home',
    component: HomeComponent
  },
  {
    path:'room/:id',
    component: RoomComponent
  },
  {
    path:'join-room',
    component: JoinRoomComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
