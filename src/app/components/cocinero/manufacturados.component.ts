import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloManofacturado } from 'src/app/models/ArticuloManofacturado';
import { ArticuloManofacturadoService } from 'src/app/services/articuloManofacturado.service';


@Component({
  selector: 'app-manufacturados',
  templateUrl: './manufacturados.component.html',
  styleUrls: ['./manufacturados.component.css']
})
export class ManufacturadosComponent implements OnInit {

  constructor(
    private articuloManofacturadoService: ArticuloManofacturadoService,
    private router: Router,
    protected route: ActivatedRoute) { }

  ngOnInit(): void {

    this.listarArticuloManofacturados();

  }


  ArticuloManofacturado: ArticuloManofacturado[] = [];
  listarArticuloManofacturados(){
    this.articuloManofacturadoService.listar().subscribe(articulos =>{
      this.ArticuloManofacturado = articulos as ArticuloManofacturado[];
    })
  }
}
