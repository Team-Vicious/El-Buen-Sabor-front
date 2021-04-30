import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Pedido } from '../models/Pedido';
import { Usuario } from '../models/usuario';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoService extends CommonService<Pedido>{

  constructor(http: HttpClient) {
    super(http);
   }

  protected baseEndPoint = BASE_ENDPOINT + '/pedido';

  getPedidosByClienteId(idCliente:number): Observable<Pedido[]>{
    return this.http.get<Pedido[]>(`${this.baseEndPoint}/pedidos-clienteId/${idCliente}`,
    {headers: this.cabeceras});
  }

}
