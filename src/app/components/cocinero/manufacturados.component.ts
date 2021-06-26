import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloManofacturado } from 'src/app/models/ArticuloManofacturado';
import { ArticuloManofacturadoService } from 'src/app/services/articuloManofacturado.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';


@Component({
  selector: 'app-manufacturados',
  templateUrl: './manufacturados.component.html',
  styleUrls: ['./manufacturados.component.css']
})
export class ManufacturadosComponent implements OnInit {



  titulo = "Manufacturado"
  manufacturado: ArticuloManofacturado = new ArticuloManofacturado();
  error: any;
  usuarioId: any;

  filterPost!: '';

  constructor(
    private service: ArticuloManofacturadoService,
    private router: Router,
    protected route: ActivatedRoute,
    private location: Location) { }

  ngOnInit(): void {
    this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;

    this.listarArticuloManofacturados();

  }


  ArticuloManofacturado: ArticuloManofacturado[] = [];
  listarArticuloManofacturados() {
    this.service.listar().subscribe(articulos => {
      this.ArticuloManofacturado = articulos as ArticuloManofacturado[];
    })
  }

  volver() {
    this.location.back();
  }

  eliminar(manufacturado: ArticuloManofacturado): void {
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

        this.service.eliminar(manufacturado.id).subscribe(
          manufacturado => {
            Swal.fire('Eliminado:', `Articulo eliminado con éxito.`, 'success');
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
          });

      }

    });
  }

  //pasar imagenes de bytes a img
  formatImage(img: any): any {
    return 'data:image/jpeg;base64,' + img;
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

        this.service.editar(manufacturado).subscribe(manufacturado => {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          }
          );
        });

      }

    });
  }



}
