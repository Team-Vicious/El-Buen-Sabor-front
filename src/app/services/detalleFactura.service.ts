import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { DetalleFactura } from '../models/DetalleFactura';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class DetalleFacturaService extends CommonService<DetalleFactura>{

  constructor(http: HttpClient) {
    super(http);
   }

  protected baseEndPoint = BASE_ENDPOINT + '/detalleFactura';

}
