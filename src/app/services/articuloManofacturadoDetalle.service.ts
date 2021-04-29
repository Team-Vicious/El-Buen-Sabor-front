import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { ArticuloManofacturadoDetalle } from '../models/ArticuloManofacturadoDetalle';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ArticuloManofacturadoDetalleService extends CommonService<ArticuloManofacturadoDetalle>{

  constructor(http: HttpClient) {
    super(http);
   }

  protected baseEndPoint = BASE_ENDPOINT + '/articuloManoFacturadoDetalle';

}
