import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { AppRoutingModule } from '../app-routing.module';
import { HistorialPedidosComponent } from './navbar/historial-pedidos/historial-pedidos.component';



@NgModule({
  declarations: [NavbarComponent, FooterComponent, HistorialPedidosComponent],
  exports: [NavbarComponent,FooterComponent],
  imports: [
    CommonModule,
    AppRoutingModule
  ]
})
export class LayoutModule { }
