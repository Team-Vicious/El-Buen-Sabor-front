import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { LayoutModule } from './layout/layout.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CajeroComponent } from './components/cajero/cajero.component';
import { CocineroComponent } from './components/cocinero/cocinero.component';
import { ManufacturadosComponent } from './components/cocinero/manufacturados.component';
import { ManufacturadosFormComponent } from './components/cocinero/manufacturados-form.component';
import { PedidosComponent } from './components/cocinero/pedidos.component';
import { InsumoFormComponent } from './components/admin/insumo-form/insumo-form.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider
} from 'angularx-social-login';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';
import { DomicilioFormComponent } from './components/register/domicilio-form/domicilio-form.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AdminComponent,
    CajeroComponent,
    CocineroComponent,
    ManufacturadosComponent,
    ManufacturadosFormComponent,
    PedidosComponent,
    InsumoFormComponent,
    DomicilioFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    LayoutModule,
    HttpClientModule,
    FormsModule,
    SocialLoginModule,
    NgxBootstrapIconsModule.pick(allIcons)
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '293888155544-30jj2jbh8rk1hlacbtfq0lpm26popne7.apps.googleusercontent.com'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
