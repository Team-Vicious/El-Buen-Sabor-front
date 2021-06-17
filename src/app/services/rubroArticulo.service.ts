import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { RubroArticulo } from '../models/RubroArticulo';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class RubroArticuloService extends CommonService<RubroArticulo>{

  constructor(http: HttpClient) {
    super(http);
   }

  protected baseEndPoint = BASE_ENDPOINT + '/rubroArticulo';

}
