import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Factura } from '../models/Factura';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class FacturaService extends CommonService<Factura>{

  constructor(http: HttpClient) {
    super(http);
   }

  protected baseEndPoint = BASE_ENDPOINT + '/factura';

  getFacturaByPedidoId(idPedido:number): Observable<Factura>{
    return this.http.get<Factura>(`${this.baseEndPoint}/factura-pedidoId/${idPedido}`,
    {headers: this.cabeceras});
  }
  
}
