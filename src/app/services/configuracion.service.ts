import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { Configuracion } from '../models/Configuracion';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService extends CommonService<Configuracion>{

  constructor(http: HttpClient) {
    super(http);
   }

  protected baseEndPoint = BASE_ENDPOINT + '/configuracion';

}
