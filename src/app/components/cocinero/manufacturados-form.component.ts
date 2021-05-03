import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloManofacturado } from 'src/app/models/ArticuloManofacturado';
import { ArticuloManofacturadoService } from 'src/app/services/articuloManofacturado.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manufacturados-form',
  templateUrl: './manufacturados-form.component.html',
  styleUrls: ['./manufacturados-form.component.css']
})
export class ManufacturadosFormComponent implements OnInit {

  titulo = "Editar Manufacturado"
  manufacturado: ArticuloManofacturado = new ArticuloManofacturado();
  error: any;
  constructor(
    private service: ArticuloManofacturadoService, 
    private router: Router,
    private route: ActivatedRoute) { }

    ngOnInit() {
      this.route.paramMap.subscribe(params => {
        const id: number = +params.get('idu')!;
        if(id){
          this.service.ver(id).subscribe(manufacturado => this.manufacturado = manufacturado)
        }
      })
    }
  

  public crear(): void {
    this.service.crear(this.manufacturado).subscribe(manufacturado => {
      Swal.fire('Nuevo:', `Manufacturado ${manufacturado.denominacion} creado con éxito`, 'success');
      this.router.navigate(['/manufacturado']);
    }, err => {
      if(err.status === 400){
        this.error = err.error;
        console.log(this.error);
      }
    });
  }


  public editar(): void {
    this.service.editar(this.manufacturado).subscribe(manufacturado => {
      console.log(manufacturado);
      Swal.fire('Modificado:', `Manufacturado ${manufacturado.denominacion} actualizado con éxito`, 'success');
      this.router.navigate(['/manufacturado']);
    }, err => {
      if(err.status === 400){
        this.error = err.error;
        console.log(this.error);
      }
    });
  }

}
