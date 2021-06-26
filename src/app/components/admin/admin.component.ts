import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloInsumo } from 'src/app/models/ArticuloInsumo';
import { ArticuloManofacturado } from 'src/app/models/ArticuloManofacturado';
import { Reporte } from 'src/app/models/Reporte';
import { Usuario } from 'src/app/models/Usuario';
import { ArticuloInsumoService } from 'src/app/services/articuloInsumo.service';
import { ArticuloManofacturadoService } from 'src/app/services/articuloManofacturado.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { ReporteService } from 'src/app/services/reporte.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  adminId!: number;

  reporte: Reporte = new Reporte();
  filterPost!: '';

  constructor(
    private reporteService: ReporteService,
    private usuarioService: UsuarioService,
    private articuloManofacturadoService: ArticuloManofacturadoService,
    private articuloInsumoService: ArticuloInsumoService,
    private router: Router,
    protected route: ActivatedRoute) { }

  ngOnInit(): void {
    this.adminId = +this.route.snapshot.paramMap.get('idu')!;
  }

  listarUsuario: boolean = false;
  usuarios: Usuario[] = [];
  listarUsuarios() {
    this.usuarioService.listar().subscribe(usuarios => {
      this.listarUsuario = true;
      this.listarArticuloManofacturado = false;
      this.listarArticuloInsumo = false;
      this.usuarios = usuarios as Usuario[];
    })
  }

  editarUsuario(usuarioId: number) {

    this.router.navigate(['update/', this.adminId , 'admin', usuarioId]);
  }


  listarArticuloManofacturado: boolean = false;
  ArticuloManofacturado: ArticuloManofacturado[] = [];
  listarArticuloManofacturados() {
    this.articuloManofacturadoService.listar().subscribe(articulos => {
      this.listarArticuloManofacturado = true;
      this.listarUsuario = false;
      this.listarArticuloInsumo = false;
      this.ArticuloManofacturado = articulos as ArticuloManofacturado[];
    })
  }


  listarArticuloInsumo:boolean = false;
  articuloInsumoArr: ArticuloInsumo[] = [];
  listarArticuloInsumos(tipo: boolean){
    this.articuloInsumoArr = [];
    this.articuloInsumoService.listar().subscribe(articulos =>{
      this.listarArticuloInsumo = true;
      this.listarArticuloManofacturado = false;
      this.listarUsuario = false;
      //this.ArticuloInsumo = articulos as ArticuloInsumo[];
      articulos.map(articulo =>{
        if(tipo == articulo.esInsumo){
          this.articuloInsumoArr.push(articulo);
        }
      })
      
    })
  }

  aumentarStockInsumo(insumo: ArticuloInsumo) {
    insumo.stockActual++;
    this.articuloInsumoService.editar(insumo).subscribe(insumo => {
      console.log("stock aumentado con exito!");
    });
  }


  //pasar imagenes de bytes a img
  formatImage(img: any): any {
    return 'data:image/jpeg;base64,' + img;
  }



  tipoReporte: number = 0;
  opcion: string = ""
  setTipoReporte(tipo: number) {
    this.tipoReporte = tipo;
    if (this.tipoReporte == 1) {
      this.opcion = "Mejor cliente";
    }
    if (this.tipoReporte == 2) {
      this.opcion = "Mejor Articulo Manufacturado";
    }
    if (this.tipoReporte == 3) {
      this.opcion = "Ingresos";
    }
    if (this.tipoReporte == 4) {
      this.opcion = "Ganancias";
    }

  }
  generarReporte() {

    if (this.tipoReporte == 1) {
      //consulta
      this.reporteService.generarReportePedidosUsuario(this.reporte).subscribe(() => {

        Swal.fire('Reporte', `Reporte Generado <br>| Cantidad de pedidos por usuario |`, 'success');
      })
    }
    if (this.tipoReporte == 2) {
      //consulta
      this.reporteService.generarReporteRankingArticulosManufacturados(this.reporte).subscribe(() => {

        Swal.fire('Reporte', `Reporte Generado <br>| Ranking de Articulos Manufacturados mas pedidos |`, 'success');
      })
    }
    if (this.tipoReporte == 3) {
      //consulta
      this.reporteService.generarReporteIngresos(this.reporte).subscribe(() => {

        Swal.fire('Reporte', `Reporte Generado <br>| Ingresos |`, 'success');
      })
    }
    if (this.tipoReporte == 4) {
      //consulta
      this.reporteService.generarReporteGanancias(this.reporte).subscribe(() => {

        Swal.fire('Reporte', `Reporte Generado <br>| Ganancias |`, 'success');
      })
    }

  }

  borrarUsuario(usuario: Usuario) {
    Swal.fire({
      title: 'Cuidado:',
      text: `¿Seguro que desea eliminar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {

        let currentUrl = this.router.url;
        usuario.fechaBaja = new Date();
        usuario.cliente.fechaBaja = new Date();
        usuario.cliente.domicilio.fechaBaja = new Date();
        this.usuarioService.editar(usuario).subscribe(usuario => {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          }
          );
        });

      }

    });
  }


  borrarInsumo(insumo: ArticuloInsumo) {

    Swal.fire({
      title: 'Cuidado:',
      text: `¿Seguro que desea eliminar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {

        let currentUrl = this.router.url;
        insumo.fechaBaja = new Date();
        this.articuloInsumoService.editar(insumo).subscribe(insumo => {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          }
          );
        });

      }

    });
  }

  borrarArticuloManofacturado(manufacturado: ArticuloManofacturado) {
    Swal.fire({
      title: 'Cuidado:',
      text: `¿Seguro que desea eliminar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {

        let currentUrl = this.router.url;
        manufacturado.fechaBaja = new Date();
        /*manufacturado.articuloManofacturadoDetalle.forEach(detalle => {
          detalle.fechaBaja=new Date();
        });*/
        this.articuloManofacturadoService.editar(manufacturado).subscribe(manufacturado => {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          }
          );
        });

      }

    });
  }



}
