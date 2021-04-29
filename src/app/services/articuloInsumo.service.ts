import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { ArticuloInsumo } from '../models/ArticuloInsumo';
import { ArticuloManofacturadoService } from './articuloManofacturado.service';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ArticuloInsumoService extends CommonService<ArticuloInsumo>{

  constructor(http: HttpClient) {
    super(http);
   }

  protected baseEndPoint = BASE_ENDPOINT + '/articuloInsumo';

}
