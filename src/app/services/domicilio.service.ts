import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Domicilio } from '../models/Domicilio';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class DomicilioService extends CommonService<Domicilio>{

  constructor(http: HttpClient) {
    super(http);
   }

  protected baseEndPoint = BASE_ENDPOINT + '/domicilio';

  findDomicilioPorClienteId(clienteId: number): Observable<Domicilio>{

    return this.http.get<Domicilio>(`${this.baseEndPoint}/domicilio-clienteId/${clienteId}`,
    
    {headers: this.cabeceras});
  }

}
