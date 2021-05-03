import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { CajeroComponent } from './components/cajero/cajero.component';
import { CocineroComponent } from './components/cocinero/cocinero.component';
import { ManufacturadosFormComponent } from './components/cocinero/manufacturados-form.component';
import { ManufacturadosComponent } from './components/cocinero/manufacturados.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './layout/navbar/navbar.component';

const routes: Routes = [
  {path:'',pathMatch: 'full', redirectTo: '/home'},
  {path:'home', component:HomeComponent},
  {path:'home/:idu', component:HomeComponent},
  {path:'register', component:RegisterComponent},
  {path:'register/admin/:ida', component:RegisterComponent},
  {path:'login', component:LoginComponent},
  {path:'update/:idu', component:RegisterComponent},
  {path:'update/:idu/admin/:ida', component:RegisterComponent},
  {path:'admin/:idu', component:AdminComponent},
  {path:'cocinero/:idu', component:CocineroComponent},
  {path:'cajero/:idu', component:CajeroComponent},
  {path:'manufacturados', component:ManufacturadosComponent},
  {path:'manufacturados/form/:idu', component:ManufacturadosFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
