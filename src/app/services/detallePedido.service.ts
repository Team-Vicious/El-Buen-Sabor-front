import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { DetallePedido } from '../models/DetallePedido';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class DetallePedidoService extends CommonService<DetallePedido>{

  constructor(http: HttpClient) {
    super(http);
   }

  protected baseEndPoint = BASE_ENDPOINT + '/detallePedido';

}
