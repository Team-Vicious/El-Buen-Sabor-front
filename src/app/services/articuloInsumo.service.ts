import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { ArticuloInsumo } from '../models/ArticuloInsumo';
import { ArticuloManofacturadoService } from './articuloManofacturado.service';
import { CommonService } from './common.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArticuloInsumoService extends CommonService<ArticuloInsumo>{

  constructor(http: HttpClient) {
    super(http);
   }

  protected baseEndPoint = BASE_ENDPOINT + '/articuloInsumo';

  verNuevo(id: number){
    return this.http.get(this.baseEndPoint + '/' + id).pipe(
      map((res:any) => {
        return res;
      })
    );
  }

  editarNuevo(articulo:ArticuloInsumo){
    return this.http.put(this.baseEndPoint + '/' + articulo.id, articulo,{headers: this.cabeceras}).pipe(
      map((res:any) => {
        return res;
      })
    );
  }

}
