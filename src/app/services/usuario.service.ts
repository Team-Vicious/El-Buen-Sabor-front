import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter } from 'ngx-bootstrap-icons';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Usuario } from '../models/Usuario';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends CommonService<Usuario>{

  constructor(http: HttpClient) {
    super(http);
   }

  protected baseEndPoint = BASE_ENDPOINT + '/usuario';

  validarUser(usuario:string, contraseña:string ): Observable<Usuario>{

    return this.http.get<Usuario>(`${this.baseEndPoint}/login/${usuario}/${contraseña}`,
    
    {headers: this.cabeceras});
  }

  validarUserMail(usuario:string): Observable<Usuario>{

    return this.http.get<Usuario>(`${this.baseEndPoint}/login/${usuario}`,
    
    {headers: this.cabeceras});
  }
  

}




