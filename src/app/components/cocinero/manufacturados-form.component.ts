import { Component, Directive, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloManofacturado } from 'src/app/models/ArticuloManofacturado';
import { ArticuloManofacturadoService } from 'src/app/services/articuloManofacturado.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: '[app-manufacturados-form,backButton]',
  templateUrl: './manufacturados-form.component.html',
  styleUrls: ['./manufacturados-form.component.css']
})

export class ManufacturadosFormComponent implements OnInit {

  titulo = "Manufacturado"
  manufacturado: ArticuloManofacturado = new ArticuloManofacturado();
  error: any;
  fotoSeleccionada!: File;
  usuarioId:any;
  validadorFoto!: Number;

  constructor(
    private service: ArticuloManofacturadoService, 
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) { }

    ngOnInit() {
      this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;
      this.route.paramMap.subscribe(params => {
        const id: number = +params.get('idm')!;
        if(id){
          this.service.ver(id).subscribe(manufacturado => this.manufacturado = manufacturado)
        }
      })
    }
  

  public crear(): void {
    this.service.crear(this.manufacturado).subscribe(manufacturado => {
      Swal.fire('Nuevo:', `Manufacturado ${manufacturado.denominacion} creado con éxito`, 'success');
      this.volver();
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
      this.volver();
    }, err => {
      if(err.status === 400){
        this.error = err.error;
        console.log(this.error);
      }
    });
  }

  //boton para volver para atras ya que se usa en admin y el cocinero
  
  volver() {
    this.location.back();
  }

  //FOTO
  //pasar imagenes de bytes a img
  formatImage(img: any): any {
    return 'data:image/jpeg;base64,' + img;
  }

  public seleccionarFoto(event: any): void{
    this.validadorFoto = 0;
    this.fotoSeleccionada = event.target.files[0];
    console.info(this.fotoSeleccionada);
    this.validadorFoto = 1;

    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire('Error', 'El archivo deber del tipo imagen', 'error');
    }
  }

  public crearConFoto(): void{
    
    if(this.validadorFoto==1){
    if(!this.fotoSeleccionada){

    }else{
      this.service.crearConFoto(this.manufacturado, this.fotoSeleccionada)
      .subscribe(articulo => {
        console.log(articulo);
        Swal.fire('Nuevo ', `${articulo.denominacion} creado con exito`, 'success');
        this.volver();
      }, err => {
        if (err.status === 400) {
          this.error = err.error;
          console.log(this.error);
        }
      })

    }}
    else{this.crear()}
  }

  public editarConFoto(): void{
    
    if(this.validadorFoto==1){
      
    if(!this.fotoSeleccionada){

    }else{
      this.service.editarConFoto(this.manufacturado, this.fotoSeleccionada)
      .subscribe(articulo => {
        console.log(articulo);
        Swal.fire('Modificado ', `${articulo.denominacion} modificado con exito`, 'success');
        this.volver();
      }, err => {
        if (err.status === 400) {
          this.error = err.error;
          console.log(this.error);
        }
      })

    }}

    else{this.editar()}
  }
}

