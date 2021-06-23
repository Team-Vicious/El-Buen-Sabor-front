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

  //validar horario
  fechaActual = new Date();
  abierto!:boolean;
  labelHorario!: string;

  articulosManofaturados: ArticuloManofacturado[] = [];
  articulosManofaturadosCarrito: ArticuloManofacturado[] = [];
  articulosInsumoGeneral: ArticuloInsumo[] = [];
  articulosInsumoNoEsInsumo: ArticuloInsumo[] = [];
  articuloInsumoCarrito: ArticuloInsumo[] = [];
  usuarioId!: number;

  filterPost!: '';

  ngOnInit(): void {
    this.traerArticulos();
    //traer id del cliente para pasar al navbar
    this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;

    if(this.fechaActual.getHours() >= 0 && this.fechaActual.getHours() < 25){
      this.abierto = true;
      this.labelHorario = "El local esta Abierto!",this.fechaActual.getTime();
      console.log("El local esta Abierto!",this.fechaActual.getHours());
      
    }else{
      this.abierto = false;
      this.labelHorario = "El local esta Cerrado!",this.fechaActual.getTime();
      console.log("El local esta Cerrado!",this.fechaActual.getHours());
    }

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

  //pasar imagenes de bytes a img
  formatImage(img: any): any {
    return 'data:image/jpeg;base64,' + img;
  }
}
