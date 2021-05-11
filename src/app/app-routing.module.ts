import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { InsumoFormComponent } from './components/admin/insumo-form/insumo-form.component';
import { CajeroComponent } from './components/cajero/cajero.component';
import { EntrantesComponent } from './components/cajero/entrantes.component';
import { CocineroComponent } from './components/cocinero/cocinero.component';
import { ManufacturadosFormComponent } from './components/cocinero/manufacturados-form.component';
import { ManufacturadosComponent } from './components/cocinero/manufacturados.component';
import { PedidosComponent } from './components/cocinero/pedidos.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DomicilioFormComponent } from './components/register/domicilio-form/domicilio-form.component';
import { RegisterComponent } from './components/register/register.component';
import { HistorialPedidosComponent } from './layout/navbar/historial-pedidos/historial-pedidos.component';

const routes: Routes = [
  {path:'',pathMatch: 'full', redirectTo: '/home'},
  {path:'home', component:HomeComponent},
  {path:'home/:idu', component:HomeComponent},
  {path:'register', component:RegisterComponent},
  {path:'register/admin/:ida', component:RegisterComponent},
  {path:'login', component:LoginComponent},
  {path:'update/:idu', component:RegisterComponent},
  {path:'update/:idu/admin/:ida', component:RegisterComponent},
  {path:'updateDomicilio/:idu', component:DomicilioFormComponent},
  {path:'admin/:idu', component:AdminComponent},
  {path:'cocinero/:idu', component:CocineroComponent},
  {path:'cajero/:idu', component:CajeroComponent},
  {path:'manufacturados', component:ManufacturadosComponent},
  {path:'manufacturados/form/:idu', component:ManufacturadosFormComponent},
  {path:'manufacturados/form', component:ManufacturadosFormComponent},
  {path:'insumo/:ida/form', component:InsumoFormComponent},
  {path:'insumo/:ida/form/:idi', component:InsumoFormComponent},
  {path:'pedidos', component:PedidosComponent},
  {path:'historialPedidos/:idu', component:HistorialPedidosComponent},
  {path:'entrantes', component:EntrantesComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
