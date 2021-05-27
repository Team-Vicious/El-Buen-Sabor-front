import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { MercadopagoDatos } from '../models/MercadopagoDatos';
import { Pedido } from '../models/Pedido';
import { Usuario } from '../models/usuario';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class MercadopagoDatosService extends CommonService<MercadopagoDatos>{

  constructor(http: HttpClient) {
    super(http);
   }

  protected baseEndPoint = BASE_ENDPOINT + '/mercadopagoDatos';

  getMPDPreferenceId(idUsuario: number, idPedido: number, pedido: Pedido): Observable<MercadopagoDatos>{
    return this.http.post<MercadopagoDatos>(`${this.baseEndPoint}/checkoutmp/${idUsuario}/pedido/${idPedido}`,
    pedido,
    {headers: this.cabeceras});
  }

}
