import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloInsumo } from 'src/app/models/ArticuloInsumo';
import { ArticuloManofacturado } from 'src/app/models/ArticuloManofacturado';
import { Reporte } from 'src/app/models/Reporte';
import { Usuario } from 'src/app/models/usuario';
import { ArticuloInsumoService } from 'src/app/services/articuloInsumo.service';
import { ArticuloManofacturadoService } from 'src/app/services/articuloManofacturado.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import {FormGroup, FormControl} from '@angular/forms';
import { ReporteService } from 'src/app/services/reporte.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  adminId!:number;
  reporte: Reporte = new Reporte();
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

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

  listarUsuario:boolean = false;
  usuarios: Usuario[] = [];
  listarUsuarios(){
    this.usuarioService.listar().subscribe(usuarios =>{
      this.listarUsuario = true;
      this.listarArticuloManofacturado = false;
      this.listarArticuloInsumo = false;
      this.usuarios = usuarios as Usuario[];
    })
  }

  editarUsuario(usuarioId: number){
    
    this.router.navigate(['update/',usuarioId,'admin',this.adminId]);
  }

  eliminarUsuario(usuarioId: number){
    this.usuarioService.eliminar(usuarioId).subscribe(usuario =>{
      console.log("usuario eliminado: ",usuario);
    })
    this.router.navigate(['admin/',this.adminId]);
    //para actualizar la vista
    this.listarUsuarios();
  }

  listarArticuloManofacturado:boolean = false;
  ArticuloManofacturado: ArticuloManofacturado[] = [];
  listarArticuloManofacturados(){
    this.articuloManofacturadoService.listar().subscribe(articulos =>{
      this.listarArticuloManofacturado = true;
      this.listarUsuario = false;
      this.listarArticuloInsumo = false;
      this.ArticuloManofacturado = articulos as ArticuloManofacturado[];
    })
  }
  
  eliminarArticuloManofacturado(manufacturado: ArticuloManofacturado):void{
    let currentUrl = this.router.url;
    Swal.fire({
      title: 'Cuidado:',
      text: `¿Seguro que desea eliminar a ${manufacturado.denominacion} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.articuloManofacturadoService.eliminar(manufacturado.id).subscribe(
          manufacturado => {
            Swal.fire('Eliminado:',`Articulo eliminado con éxito.`,'success');
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this.router.navigate([currentUrl]);
          });
            });

        }
      
      });
    }

  listarArticuloInsumo:boolean = false;
  ArticuloInsumo: ArticuloInsumo[] = [];
  listarArticuloInsumos(){
    this.articuloInsumoService.listar().subscribe(articulos =>{
      this.listarArticuloInsumo = true;
      this.listarArticuloManofacturado = false;
      this.listarUsuario = false;
      this.ArticuloInsumo = articulos as ArticuloInsumo[];
    })
  }

  aumentarStockInsumo(insumo: ArticuloInsumo){
    insumo.stockActual++;
    this.articuloInsumoService.editar(insumo).subscribe(insumo =>{
      console.log("stock aumentado con exito!");
    });
  }

  eliminarInsumo(insumoId: number){
    this.articuloInsumoService.eliminar(insumoId).subscribe(insumo =>{
      console.log("usuario eliminado: ",insumo);
    })
    this.router.navigate(['admin/',this.adminId]);
    //para actualizar la vista
    this.listarArticuloInsumos();
  }

  //pasar imagenes de bytes a img
  formatImage(img: any): any {
    return 'data:image/jpeg;base64,' + img;
  }

  

  tipoReporte:number = 0;
  opcion:string = ""
  setTipoReporte(tipo:number){
    this.tipoReporte = tipo;
    if(this.tipoReporte == 1){
      this.opcion = "Mejor cliente"; 
    }
    if(this.tipoReporte == 2){
      this.opcion = "Mejor Articulo Manufacturado";
    }
    if(this.tipoReporte == 3){
      this.opcion = "Ingresos";
    }
    if(this.tipoReporte == 4){
      this.opcion = "Ganancias";
    }
    
  }
  generarReporte(){
    
    if(this.tipoReporte == 1){
      //consulta
      this.reporteService.generarReportePedidosUsuario(this.reporte).subscribe(reporte =>{

        Swal.fire('Reporte',`Reporte Generado <br>| Cantidad de pedidos por usuario |`,'success');
      })
    }
    if(this.tipoReporte == 2){
      //consulta
      this.reporteService.generarReporteRankingArticulosManufacturados(this.reporte).subscribe(reporte =>{

        Swal.fire('Reporte',`Reporte Generado <br>| Ranking de Articulos Manufacturados mas pedidos |`,'success');
      })
    }
    if(this.tipoReporte == 3){
      //consulta
      this.reporteService.generarReporteIngresos(this.reporte).subscribe(reporte =>{

        Swal.fire('Reporte',`'Reporte Generado <br>| Ingresos |`,'success');
      })
    }
    if(this.tipoReporte == 4){
      //consulta
      this.reporteService.generarReporteGanancias(this.reporte).subscribe(reporte =>{

        Swal.fire('Reporte',`Reporte Generado <br>| Ganancias |`,'success');
      })
    }
    
  }

}
