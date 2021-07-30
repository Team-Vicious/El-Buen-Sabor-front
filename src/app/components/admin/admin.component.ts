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
import { RubroArticulo } from 'src/app/models/RubroArticulo';
import { RubroGeneralService } from 'src/app/services/rubroGeneral.service';
import { RubroArticuloService } from 'src/app/services/rubroArticulo.service';
import { RubroGeneral } from 'src/app/models/RubroGeneral';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { Pedido } from 'src/app/models/Pedido';
import { PedidoService } from 'src/app/services/pedido.service';


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
    private configuracionService: ConfiguracionService,
    private rubroGeneralService: RubroGeneralService,
    private pedidoService: PedidoService,
    private rubroArticuloService: RubroArticuloService,
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
      this.listarRubroArticulo = false;
      this.listarRubroGeneral = false;
      this.usuarios = usuarios as Usuario[];

      //verificar cantidad de cocineros
      var cantCocineros = 0;
      this.usuarios.map(us => {
        if (us.rol == 'cocinero') {
          cantCocineros = cantCocineros + 1;
        }
      })
      this.configuracionService.ver(1).subscribe(configuracion => {
        configuracion.cantidadCocineros = cantCocineros;
        this.configuracionService.editar(configuracion).subscribe(conf => console.log('cantidad cocineros actualizada'));
      });
    })

  }

  editarUsuario(usuarioId: number) {

    this.router.navigate(['update/', usuarioId, 'admin', this.adminId]);
  }


  listarArticuloManofacturado: boolean = false;
  ArticuloManofacturado: ArticuloManofacturado[] = [];
  listarArticuloManofacturados() {
    this.articuloManofacturadoService.listar().subscribe(articulos => {
      this.listarArticuloManofacturado = true;
      this.listarUsuario = false;
      this.listarArticuloInsumo = false;
      this.listarRubroArticulo = false;
      this.listarRubroGeneral = false;
      this.ArticuloManofacturado = articulos as ArticuloManofacturado[];
    })
  }


  listarArticuloInsumo: boolean = false;
  articuloInsumoArr: ArticuloInsumo[] = [];
  listarArticuloInsumos(tipo: boolean) {
    this.articuloInsumoArr = [];
    this.articuloInsumoService.listar().subscribe(articulos => {
      this.listarArticuloInsumo = true;
      this.listarArticuloManofacturado = false;
      this.listarUsuario = false;
      this.listarRubroArticulo = false;
      this.listarRubroGeneral = false;
      //this.ArticuloInsumo = articulos as ArticuloInsumo[];
      articulos.map(articulo => {
        if (tipo == articulo.esInsumo) {
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

    if(this.reporte.fechaDestino != undefined && this.reporte.fechaInicio != undefined  && this.tipoReporte > 0){

    
    if (this.tipoReporte == 1) {
      //consulta


      this.reporteService.generarReportePedidosUsuario(this.reporte).subscribe(() => {

        Swal.fire('Reporte', `Reporte Generado <br>| Cantidad de pedidos por usuario |`, 'success');
      }, error => {
        Swal.fire('Reporte', `El Reporte no se pudo generar 
        <br>| verifique que el reporte no este ya generado un su disco D: |`, 'error');
      });

    }
    if (this.tipoReporte == 2) {
      //consulta
      this.reporteService.generarReporteRankingArticulosManufacturados(this.reporte).subscribe(() => {

        Swal.fire('Reporte', `Reporte Generado <br>| Ranking de Articulos Manufacturados mas pedidos |`, 'success');
      }, error => {
        Swal.fire('Reporte', `El Reporte no se pudo generar 
        <br>| verifique que el reporte no este ya generado un su disco D: |`, 'error');
      })
    }
    if (this.tipoReporte == 3) {
      //consulta
      this.reporteService.generarReporteIngresos(this.reporte).subscribe(() => {

        Swal.fire('Reporte', `Reporte Generado <br>| Ingresos |`, 'success');
      }, error => {
        Swal.fire('Reporte', `El Reporte no se pudo generar 
        <br>| verifique que el reporte no este ya generado un su disco D: |`, 'error');
      })
    }
    if (this.tipoReporte == 4) {
      //consulta
      this.reporteService.generarReporteGanancias(this.reporte).subscribe(() => {

        Swal.fire('Reporte', `Reporte Generado <br>| Ganancias |`, 'success');
      }, error => {
        Swal.fire('Reporte', `El Reporte no se pudo generar 
        <br>| verifique que el reporte no este ya generado un su disco D: |`, 'error');
      })
    }
  }else{
    Swal.fire('Reporte Error', `Verifique que ha seleccionado el tipo de reporte y las fechas desde-hasta`, 'error');
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

  listarRubroArticulo: boolean = false;
  rubroArticuloArr: RubroArticulo[] = [];
  listarRubrosArticulo() {
    this.rubroArticuloService.listar().subscribe(rubros => {
      this.listarRubroArticulo = true;
      this.listarRubroGeneral = false;
      this.listarArticuloManofacturado = false;
      this.listarUsuario = false;
      this.listarArticuloInsumo = false;
      this.rubroArticuloArr = rubros as RubroArticulo[];
      console.log("listados");
    });
  }

  eliminarRubroArticulo(rubro: RubroArticulo) {
    rubro.fechaBaja = new Date();
    this.rubroArticuloService.editar(rubro).subscribe(rubroUpdate => {
      console.log("rubro dado de baja!");
    });
  }

  listarRubroGeneral: boolean = false;
  rubroGeneralArr: RubroGeneral[] = [];
  listarRubrosGeneral() {
    this.rubroGeneralService.listar().subscribe(rubros => {
      this.listarRubroGeneral = true;
      this.listarRubroArticulo = false;
      this.listarArticuloManofacturado = false;
      this.listarUsuario = false;
      this.listarArticuloInsumo = false;
      this.rubroGeneralArr = rubros as RubroGeneral[];
      console.log("listados");
    });
  }

  eliminarRubroGeneral(rubro: RubroGeneral) {
    rubro.fechaBaja = new Date();
    this.rubroGeneralService.editar(rubro).subscribe(rubroUpdate => {
      console.log("rubro dado de baja!");
    });
  }

  mostrarConfiguracion() {

    this.configuracionService.ver(1).subscribe(config => {

      Swal.fire({
        icon: 'info',
        html: `
              <h5>
              Email de la empresa: ${config.emailEmpresa}
              </h5>
              <br>
              <h5>
              Cantidad de cocineros: ${config.cantidadCocineros}
              </h5>
              <br>
              <br>
              Token Mercado Pago: 
              <br>
              ${config.tokenMercadoPago} 
              <br>
              <br>
              Public Key Mercado Pago: 
              <br>
              TEST-5e5336b3-df68-40ba-8aa8-6882cc2bdf42`
      });

    });
  }

  listarPedido: boolean = false;
  Pedidos: Pedido[] = [];
  listarPedidos() {
    this.listarPedido = true;
    this.listarRubroArticulo = false;
    this.listarArticuloManofacturado = false;
    this.listarUsuario = false;
    this.listarArticuloInsumo = false;
    this.listarRubroGeneral = false;
    this.pedidoService.listar().subscribe(pedido => {
      this.Pedidos = pedido as Pedido[];
    })

  }

  filtrarPedidosXFecha(){
    this.Pedidos = [];
    this.listarPedido = true;
    this.listarRubroArticulo = false;
    this.listarArticuloManofacturado = false;
    this.listarUsuario = false;
    this.listarArticuloInsumo = false;
    this.listarRubroGeneral = false;
    this.pedidoService.getPedidosByFechas(this.reporte).subscribe(pedido => {
      this.Pedidos = pedido as Pedido[];
    })
  }

  exportarPedidosExcel(){
    this.reporteService.generarReportePedidos(this.reporte).subscribe( reporte => {
      Swal.fire('Reporte', `Reporte Generado <br>| Pedidos |`, 'success');
    },err => {
      Swal.fire('Reporte', `El Reporte no se pudo generar 
      <br>| verifique que el reporte no este ya generado un su disco D: |`, 'error');
    });
  }

  acortarDecimales(numero: number){
    return numero.toFixed(2);
  }


}
