import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { ArticuloManofacturado } from '../models/ArticuloManofacturado';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ArticuloManofacturadoService extends CommonService<ArticuloManofacturado>{

  constructor(http: HttpClient) {
    super(http);
    
   }

  protected baseEndPoint = BASE_ENDPOINT + '/articuloManoFacturado';

}
