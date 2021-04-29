import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloManofacturado } from 'src/app/models/ArticuloManofacturado';
import { ArticuloManofacturadoService } from 'src/app/services/articuloManofacturado.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(protected services: ArticuloManofacturadoService,
    protected router: Router,
    protected route: ActivatedRoute) { }

  articulosManofaturados: ArticuloManofacturado[] = [];
  clienteId!:number;

  ngOnInit(): void {
    this.traerArticulosManofacturados()
    this.clienteId = +this.route.snapshot.paramMap.get('idc')!;
  }

  private traerArticulosManofacturados(){
    
    this.services.listar()
    .subscribe(p => 
      {
        this.articulosManofaturados = p as ArticuloManofacturado[];
      });
  }

}
