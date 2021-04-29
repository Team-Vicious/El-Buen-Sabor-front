import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './layout/navbar/navbar.component';

const routes: Routes = [
  {path:'',pathMatch: 'full', redirectTo: '/home'},
  {path:'home', component:HomeComponent},
  {path:'home/:idc', component:HomeComponent},
  {path:'login', component:LoginComponent},
  {path:'admin', component:AdminComponent},
  {path:'register', component:RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
