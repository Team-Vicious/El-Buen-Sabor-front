import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { RubroGeneral } from '../models/RubroGeneral';
import { Usuario } from '../models/usuario';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class RubroGeneralService extends CommonService<RubroGeneral>{

  constructor(http: HttpClient) {
    super(http);
   }

  protected baseEndPoint = BASE_ENDPOINT + '/rubroGeneral';

}
