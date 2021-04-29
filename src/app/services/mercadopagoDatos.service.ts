import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { MercadopagoDatos } from '../models/MercadopagoDatos';
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

}
