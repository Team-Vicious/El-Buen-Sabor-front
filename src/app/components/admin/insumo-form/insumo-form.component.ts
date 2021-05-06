import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloInsumo } from 'src/app/models/ArticuloInsumo';
import { ArticuloInsumoService } from 'src/app/services/articuloInsumo.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insumo-form',
  templateUrl: './insumo-form.component.html',
  styleUrls: ['./insumo-form.component.css']
})
export class InsumoFormComponent implements OnInit {

  constructor(
    private service: ArticuloInsumoService, 
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) { }

  insumo:ArticuloInsumo = new ArticuloInsumo();
  error: any;
  titulo = "Insumo"
  adminId!: any;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('idi')!;
      this.adminId = +params.get('ida')!;
      if(id){
        this.service.ver(id).subscribe(insumo => this.insumo = insumo)
      }
    })

    
  }

  public crear(): void {
    this.service.crear(this.insumo).subscribe(insumo => {
      Swal.fire('Nuevo:', `Insumo ${insumo.denominacion} creado con éxito`, 'success');
      this.router.navigate(['/admin',this.adminId]);
    }, err => {
      if(err.status === 400){
        this.error = err.error;
        console.log(this.error);
      }
    });
  }


  public editar(): void {
    this.service.editar(this.insumo).subscribe(insumo => {
      console.log(insumo);
      Swal.fire('Modificado:', `Manufacturado ${insumo.denominacion} actualizado con éxito`, 'success');
      this.router.navigate(['/admin',this.adminId]);
    }, err => {
      if(err.status === 400){
        this.error = err.error;
        console.log(this.error);
      }
    });
  }

  //boton para volver para atras ya que se usa en admin y el cocinero
  @HostListener('click')
    onClick() {
        this.location.back();
  }

  setearInsumo(esInsumo: boolean){
    this.insumo.esInsumo = esInsumo;
  }

}
