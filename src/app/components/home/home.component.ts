import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloInsumo } from 'src/app/models/ArticuloInsumo';
import { ArticuloInsumoService } from 'src/app/services/articuloInsumo.service';
import { ArticuloManofacturado } from 'src/app/models/ArticuloManofacturado';
import { ArticuloManofacturadoService } from 'src/app/services/articuloManofacturado.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    protected articuloManofacturadoServices: ArticuloManofacturadoService,
    protected articuloInsumoService: ArticuloInsumoService,
    protected router: Router,
    protected route: ActivatedRoute) { }

  articulosManofaturados: ArticuloManofacturado[] = [];
  articulosManofaturadosCarrito: ArticuloManofacturado[] = [];
  articulosInsumoGeneral: ArticuloInsumo[] = [];
  articulosInsumoNoEsInsumo: ArticuloInsumo[] = [];
  articuloInsumoCarrito: ArticuloInsumo[] = [];
  clienteId!: number;

  ngOnInit(): void {
    this.traerArticulos();
    //traer id del cliente para pasar al navbar
    this.clienteId = +this.route.snapshot.paramMap.get('idc')!;


  }

  private traerArticulos() {
    //obtener art manofacturados
    this.articuloManofacturadoServices.listar()
      .subscribe(p => {
        this.articulosManofaturados = p as ArticuloManofacturado[];
      });

    //obtener art insumos
    this.articuloInsumoService.listar().subscribe(p => {

      this.articulosInsumoGeneral = p as ArticuloInsumo[];

      //filtro los que no son insumo
      this.articulosInsumoGeneral.map(art => {
        if (art.esInsumo == false) {
          this.articulosInsumoNoEsInsumo.push(art);
        }
      });
    });

  }



  almacenarArticulosManofacturadosSeleccionados(idArtuculo: number) {

    this.articulosManofaturados.map(articulo => {
      if (articulo.id == idArtuculo) {
        this.articulosManofaturadosCarrito.push(articulo);
      }
    })
  }

  almacenarArticulosInsumoSeleccionados(idArtuculo: number) {

    this.articulosInsumoNoEsInsumo.map(articulo => {
      if (articulo.id == idArtuculo) {
        this.articuloInsumoCarrito.push(articulo);
      }
    })
  }
}
