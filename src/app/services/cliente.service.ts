import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { Cliente } from '../models/Cliente';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends CommonService<Cliente>{

  constructor(http: HttpClient) {
    super(http);
   }

  protected baseEndPoint = BASE_ENDPOINT + '/cliente';

}
