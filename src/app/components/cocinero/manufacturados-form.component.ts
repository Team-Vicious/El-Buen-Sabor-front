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
  rubroGeneral!: RubroGeneral;

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

    /*
    //(validador)mejor que elija foto obligatoriamente
    this.service.crear(this.manufacturado)
      .subscribe(articulo => {
        articulo.articuloManofacturadoDetalle = [];
        this.manufacturado.articuloManofacturadoDetalle.map(detalle => {
          this.serviceArticuloManufacturadoDetalle.crear(detalle).subscribe(det => {

            articulo.articuloManofacturadoDetalle.push(det);
            //actualizo el manufacturado
            this.service.editar(articulo).subscribe(manuf => {
              console.log("manuf detalle agregado");
            });
          })
        });
        //articulo.articuloManofacturadoDetalle = this.manufacturado.articuloManofacturadoDetalle;

        //console.log(articulo);
        Swal.fire('Nuevo ', `${articulo.denominacion} creado con exito`, 'success');
        this.volver();

      }, err => {
        if (err.status === 400) {
          this.error = err.error;
          console.log(this.error);
        }
      })
      */
    Swal.fire('ERROR', `falta agregar una imagen!`, 'error');
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
    if (this.manufacturado.denominacion && this.manufacturado.precioVenta &&
      this.manufacturado.tiempoEstimadoCocina && this.manufacturado.rubroGeneral &&
      this.manufacturado.articuloManofacturadoDetalle && this.manufacturado.articuloManofacturadoDetalle.length > 0) {




      if (this.validadorFoto == 1) {
        if (!this.fotoSeleccionada) {

        } else {
          this.service.crearConFoto(this.manufacturado, this.fotoSeleccionada)
            .subscribe(articulo => {
              articulo.articuloManofacturadoDetalle = [];
              this.manufacturado.articuloManofacturadoDetalle.map(detalle => {
                this.serviceArticuloManufacturadoDetalle.crear(detalle).subscribe(det => {

                  articulo.articuloManofacturadoDetalle.push(det);
                  //actualizo el manufacturado
                  this.service.editar(articulo).subscribe(manuf => {
                    console.log("manuf detalle agregado");
                  });
                })

              });
              //articulo.articuloManofacturadoDetalle = this.manufacturado.articuloManofacturadoDetalle;

              articulo.rubroGeneral = this.rubroGeneral;
              this.service.editar(articulo).subscribe(art => {
                console.log("rubro asignado");
                //console.log(articulo);
                Swal.fire('Nuevo ', `${articulo.denominacion} creado con exito`, 'success');
                this.volver();
              });

            }, err => {
              if (err.status === 400) {
                this.error = err.error;
                console.log(this.error);
              }
            })

        }
      }
      else { this.crear() }
    } else {
      Swal.fire('Error', `Hay campos incompletos, por favor rellene todos los campos.
    <br> Tampoco se olvide de los detalles del Manufacturado!`, 'error');
    }
  }

  public editarConFoto(): void {
    if (this.manufacturado.denominacion && this.manufacturado.precioVenta &&
      this.manufacturado.tiempoEstimadoCocina && this.manufacturado.rubroGeneral && this.manufacturado.articuloManofacturadoDetalle) {


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
    } else {
      Swal.fire('Error', `Hay campos incompletos, por favor rellene todos los campos.
  <br> Tampoco se olvide de los detalles del Manufacturado!`, 'error');
    }
  }

  asignarRubro(rubro: RubroGeneral) {


    this.manufacturado.rubroGeneral = rubro as RubroGeneral;
    console.log("rubro asignado", this.manufacturado.rubroGeneral.denominacion);


    if (this.manufacturado.id) {

      this.service.editar(this.manufacturado).subscribe(manuf => console.log("rubro actualizado"));
    } else {
      this.rubroGeneral = rubro;
      //this.manufacturado.rubroGeneral = rubro;
    }

  }

  asignarInsumo(insumo: ArticuloInsumo) {
    this.articuloInsumo = insumo;
    console.log(insumo.denominacion);
  }

  asignarDetalle() {
    if (this.detalleArticuloManufacturado.unidadMedida && this.detalleArticuloManufacturado.cantidad &&
      this.articuloInsumo) {

      //le asigno el insumo
      console.log(this.articuloInsumo.denominacion);
      this.detalleArticuloManufacturado.articuloInsumo = this.articuloInsumo;
      var detalleAux: ArticuloManofacturadoDetalle = new ArticuloManofacturadoDetalle();
      detalleAux.articuloInsumo = this.detalleArticuloManufacturado.articuloInsumo;
      detalleAux.cantidad = this.detalleArticuloManufacturado.cantidad;
      detalleAux.unidadMedida = this.detalleArticuloManufacturado.unidadMedida;



      if (this.manufacturado.id) {
        this.serviceArticuloManufacturadoDetalle.crear(detalleAux).subscribe(detalle => {

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


      }
      if (!this.manufacturado.id) {
        //lo asigno al manufacturado

        this.manufacturado.articuloManofacturadoDetalle.push(detalleAux);
        console.log("detalle agregado\n", detalleAux);
      }

    } else {
      Swal.fire('Error', `Hay campos incompletos, por favor rellene todos los campos.`, 'error');
    }

  }

  eliminarDetalle(detalleParametro: ArticuloManofacturadoDetalle) {

    if (this.manufacturado.id) {

      this.service.ver(this.manufacturado.id).subscribe(manufacturado => {
        this.manufacturado = manufacturado;

        this.manufacturado.articuloManofacturadoDetalle.map(detalle => {
          if (detalle.id == detalleParametro.id) {
            //dar de baja
            detalle.fechaBaja = new Date();
            this.serviceArticuloManufacturadoDetalle.editar(detalle).subscribe(det => {
              console.log("detalle dado de baja", det);
            });
          }

        });
      });

    } else {
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

  }
}

