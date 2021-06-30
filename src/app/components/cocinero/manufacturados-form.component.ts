import { Component, Directive, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloManofacturado } from 'src/app/models/ArticuloManofacturado';
import { ArticuloManofacturadoService } from 'src/app/services/articuloManofacturado.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { RubroGeneralService } from 'src/app/services/rubroGeneral.service';
import { RubroGeneral } from 'src/app/models/RubroGeneral';
import { ArticuloManofacturadoDetalle } from 'src/app/models/ArticuloManofacturadoDetalle';
import { ArticuloInsumo } from 'src/app/models/ArticuloInsumo';
import { ArticuloInsumoService } from 'src/app/services/articuloInsumo.service';
import { ArticuloManofacturadoDetalleService } from 'src/app/services/articuloManofacturadoDetalle.service';

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
  usuarioId: any;
  validadorFoto!: Number;
  rubrosGenerales!: RubroGeneral[];
  detallesArticuloManufacturado: ArticuloManofacturadoDetalle[] = [];
  detalleArticuloManufacturado: ArticuloManofacturadoDetalle = new ArticuloManofacturadoDetalle();
  articulosInsumos: ArticuloInsumo[] = [];
  articuloInsumo!: ArticuloInsumo;

  constructor(
    private serviceRubros: RubroGeneralService,
    private serviceInsumos: ArticuloInsumoService,
    private service: ArticuloManofacturadoService,
    private serviceArticuloManufacturadoDetalle: ArticuloManofacturadoDetalleService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) { }

  ngOnInit() {
    this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('idm')!;
      if (id) {
        this.service.ver(id).subscribe(manufacturado => {
          this.manufacturado = manufacturado

        });
      }
    });

    this.serviceRubros.listar().subscribe(rubros => {
      this.rubrosGenerales = rubros as RubroGeneral[];
    });

    this.serviceInsumos.listar().subscribe(insumos => {
      this.articulosInsumos = insumos as ArticuloInsumo[];
    })
  }


  public crear(): void {
    this.service.crear(this.manufacturado).subscribe(manufacturado => {
      Swal.fire('Nuevo:', `Manufacturado ${manufacturado.denominacion} creado con éxito`, 'success');
      this.volver();
    }, err => {
      if (err.status === 400) {
        this.error = err.error;
        console.log(this.error);
      }
    });
  }


  public editar(): void {

    console.log(this.manufacturado);
    this.service.editar(this.manufacturado).subscribe(manufacturado => {
      console.log(manufacturado);
      Swal.fire('Modificado:', `Manufacturado ${manufacturado.denominacion} actualizado con éxito`, 'success');
      this.volver();
    }, err => {
      if (err.status === 400) {
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

  public seleccionarFoto(event: any): void {
    this.validadorFoto = 0;
    this.fotoSeleccionada = event.target.files[0];
    console.info(this.fotoSeleccionada);
    this.validadorFoto = 1;

    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire('Error', 'El archivo deber del tipo imagen', 'error');
    }
  }

  public crearConFoto(): void {

    if (this.validadorFoto == 1) {
      if (!this.fotoSeleccionada) {

      } else {
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

      }
    }
    else { this.crear() }
  }

  public editarConFoto(): void {

    if (this.validadorFoto == 1) {

      if (!this.fotoSeleccionada) {

      } else {
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

      }
    }

    else { this.editar() }
  }

  asignarRubro(rubro: RubroGeneral) {
    this.manufacturado.rubroGeneral = rubro as RubroGeneral;
    console.log("rubro asignado", this.manufacturado.rubroGeneral.denominacion);

    if(this.manufacturado.id){

      this.service.editar(this.manufacturado).subscribe(manuf => console.log("rubro actualizado"));
    }else{
      this.manufacturado.rubroGeneral = rubro;
    }
  }

  asignarInsumo(articuloInsumo: ArticuloInsumo) {
    this.articuloInsumo = articuloInsumo;
  }

  asignarDetalle() {
    //le asigno el insumo
    this.detalleArticuloManufacturado.articuloInsumo = this.articuloInsumo;

    

    if(this.manufacturado.id){
      this.serviceArticuloManufacturadoDetalle.crear(this.detalleArticuloManufacturado).subscribe(detalle => {

        //esto lo hago para que al momento de agregar un articulo o eliminar, que traiga la lista actualizada
        //y despues lo agrega y despues actualiza porque sino quedan detalles en el aire y da error el update
        this.service.ver(this.manufacturado.id).subscribe(manufacturado => {
          this.manufacturado = manufacturado;
         
          //asigno el detalle al articulo
          this.manufacturado.articuloManofacturadoDetalle.push(detalle);
  
          //edito el manufacturado
          this.service.editar(this.manufacturado).subscribe(manu => {
            console.log("detalle agregado");
            this.manufacturado = manu;
          });
        });
      });
      
      /*
      this.service.ver(this.manufacturado.id).subscribe(manufacturado => {
        this.manufacturado = manufacturado;
        
        //lo asigno al manufacturado
        this.manufacturado.articuloManofacturadoDetalle.push(this.detalleArticuloManufacturado);

        //edito el manufacturado
        this.service.editar(this.manufacturado).subscribe(manu => {
          console.log("detalle agregado");
          this.manufacturado = manu;
        });

      });
      */

      
    }else{
      //lo asigno al manufacturado
      this.manufacturado.articuloManofacturadoDetalle.push(this.detalleArticuloManufacturado);
    }

    



    /*

    this.serviceArticuloManufacturadoDetalle.crear(this.detalleArticuloManufacturado).subscribe(detalle => {

      //esto lo hago para que al momento de agregar un articulo o eliminar, que traiga la lista actualizada
      //y despues lo agrega y despues actualiza porque sino quedan detalles en el aire y da error el update
      this.service.ver(this.manufacturado.id).subscribe(manufacturado => {
        this.manufacturado = manufacturado;
       
        //asigno el detalle al articulo
        this.manufacturado.articuloManofacturadoDetalle.push(detalle);

        //edito el manufacturado
        this.service.editar(this.manufacturado).subscribe(manu => {
          console.log("detalle agregado");
          this.manufacturado = manu;
        });
      });
    });
    */
  }

  eliminarDetalle(detalleParametro: ArticuloManofacturadoDetalle) {

    if(this.manufacturado.id){

      this.service.ver(this.manufacturado.id).subscribe(manufacturado => {
        this.manufacturado = manufacturado;

        this.manufacturado.articuloManofacturadoDetalle.map(detalle => {
          if (detalle.id == detalleParametro.id) {
            //dar de baja
            detalle.fechaBaja = new Date();
            this.serviceArticuloManufacturadoDetalle.editar(detalle).subscribe(det =>{
              console.log("detalle dado de baja",det);
            }); 
          }
          
        });
      });

    }else{
      //eliminar del array
      var i: number = 0;
      this.manufacturado.articuloManofacturadoDetalle.map(detalle => {
        if (detalle.articuloInsumo == detalleParametro.articuloInsumo
        && detalle.cantidad == detalleParametro.cantidad
        && detalle.unidadMedida == detalleParametro.unidadMedida) {
          this.manufacturado.articuloManofacturadoDetalle.splice(i, 1);
        }
        i++;
      });
    }
    /*
    var i: number = 0;
    this.manufacturado.articuloManofacturadoDetalle.map(detalle => {
      if (detalle.id == detalleParametro.id) {
          //dar de baja
          detalle.fechaBaja = new Date();
          this.serviceArticuloManufacturadoDetalle.editar(detalle).subscribe(det =>{
            console.log("detalle dado de baja",det);
          }); 
          //this.detallesArticuloManufacturado.splice(i, 1)
      }
      i++;
    });
    */
  }
}

