import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Reporte } from '../models/Reporte';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(protected http: HttpClient) { }

  protected cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  protected baseEndPoint = BASE_ENDPOINT + '/pedido';

  generarReporteIngresos(reporte:Reporte): Observable<String>{
    return this.http.post(`${this.baseEndPoint}/reporte-ingresos`,
    reporte,
    {responseType: 'text'});
  }

  generarReporteRankingArticulosManufacturados(reporte:Reporte): Observable<string>{
    return this.http.post(`${this.baseEndPoint}/reporte-ranking`,
    reporte,
    {responseType: 'text'});
  }

  generarReporteGanancias(reporte:Reporte): Observable<string>{
    return this.http.post(`${this.baseEndPoint}/reporte-ganancias`,
    reporte,
    {responseType: 'text'});
  }

  generarReportePedidosUsuario(reporte:Reporte): Observable<string>{
    return this.http.post(`${this.baseEndPoint}/reporte-pedidosusuario`,
    reporte,
    {responseType: 'text'});
  }

  generarReportePedidos(reporte:Reporte): Observable<string>{
    return this.http.post(`${this.baseEndPoint}/reporte-pedidos`,
    reporte,
    {responseType: 'text'});
  }
}
