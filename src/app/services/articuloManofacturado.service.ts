import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  public crearConFoto(articulo: ArticuloManofacturado, foto: File): Observable<ArticuloManofacturado>{
    const formData = new FormData();
    formData.append('foto', foto);
    formData.append('tiempoEstimadoCocina', articulo.tiempoEstimadoCocina.toString());
    formData.append('denominacion', articulo.denominacion);
    formData.append('precioVenta', articulo.precioVenta.toString());
    return this.http.post<ArticuloManofacturado>(this.baseEndPoint +'/crear', formData);
  }

  public editarConFoto(articulo: ArticuloManofacturado, foto: File): Observable<ArticuloManofacturado>{
    const formData = new FormData();
    formData.append('foto', foto);
    formData.append('tiempoEstimadoCocina', articulo.tiempoEstimadoCocina.toString());
    formData.append('denominacion', articulo.denominacion);
    formData.append('precioVenta', articulo.precioVenta.toString());
    return this.http.put<ArticuloManofacturado>(`${this.baseEndPoint}/editar/${articulo.id}`, formData);
  }

}
