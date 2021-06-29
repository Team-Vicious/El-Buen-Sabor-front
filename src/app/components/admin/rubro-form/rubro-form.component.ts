import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RubroArticulo } from 'src/app/models/RubroArticulo';
import { RubroGeneral } from 'src/app/models/RubroGeneral';
import { RubroArticuloService } from 'src/app/services/rubroArticulo.service';
import { RubroGeneralService } from 'src/app/services/rubroGeneral.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rubro-form',
  templateUrl: './rubro-form.component.html',
  styleUrls: ['./rubro-form.component.css']
})
export class RubroFormComponent implements OnInit {


  rubroGeneral: RubroGeneral = new RubroGeneral();
  rubroArticulo: RubroArticulo = new RubroArticulo();
  formGeneral: boolean = false;
  formArticulo: boolean = false;

  usuarioId!: number;
  tipoRubro!: string;
  rubroId!: number;
  rubrosArticulos: RubroArticulo[] = [];

  constructor(private serviceRubroGeneral: RubroGeneralService, 
    private serviceRubroArticulo: RubroArticuloService, 
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) { }

  ngOnInit(): void {
    this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;
    this.tipoRubro = this.route.snapshot.paramMap.get('tipo')!;
    this.rubroId = +this.route.snapshot.paramMap.get('idr')!;

    //depende el tipo trae, utiliza un objeto o el otro y verifica si tiene id para editar sino crear
    if(this.tipoRubro == 'general'){
      if(this.rubroId){
        this.serviceRubroGeneral.ver(this.rubroId).subscribe( rubro => {
          this.rubroGeneral = rubro;
        });

      }
      this.formGeneral = true;

    }

    if(this.tipoRubro == 'articulo'){
      if(this.rubroId){
        this.serviceRubroArticulo.ver(this.rubroId).subscribe( rubro => {
          this.rubroArticulo = rubro;
        });

      }

      //listo los rubros para asignarle un padre a rubro articulo despues
      this.serviceRubroArticulo.listar().subscribe( rubros =>{
        this.rubrosArticulos = rubros as RubroArticulo[];
        console.log("rubros traidos");
      });

      this.formArticulo = true;

    }
    
    
  }

  crearRubro(){
    if(this.tipoRubro == 'general'){
      this.serviceRubroGeneral.crear(this.rubroGeneral).subscribe( rubro => {
        console.log("rubro general creado");
        Swal.fire('CREADO!',`Rubro creado con exito`,'success');
        this.volver();
      });

    }

    if(this.tipoRubro == 'articulo'){
      this.serviceRubroArticulo.crear(this.rubroArticulo).subscribe( rubro => {
        console.log("rubro articulo creado");
        Swal.fire('CREADO!',`Rubro creado con exito`,'success');
        this.volver();
      });

    }

  }

  editarRubro(){
    if(this.tipoRubro == 'general'){
      if(this.rubroId){
        this.serviceRubroGeneral.editar(this.rubroGeneral).subscribe( rubro => {
          console.log("rubro general editado");
          Swal.fire('EDITADO!',`Rubro editado con exito`,'success');
          this.volver();
        });

      }

    }

    if(this.tipoRubro == 'articulo'){
      if(this.rubroId){
        this.serviceRubroArticulo.editar(this.rubroArticulo).subscribe( rubro => {
          console.log("rubro articulo editado");
          Swal.fire('EDITADO!',`Rubro editado con exito`,'success');
          this.volver();
        });

      }

    }

  }

  asignarRubroPadre(rubroPadre: RubroArticulo){
    this.rubroArticulo.padre = rubroPadre;
    this.serviceRubroArticulo.editar(this.rubroArticulo).subscribe( rubro => {
      console.log("rubro padre asignado-actualizado")
    });
  }

  sacarRubroPadre(){
    var rubroAuxSinPadre: RubroArticulo = new RubroArticulo();
    //creo un rubro y le paso los valores pero sin padre y actualizo
    rubroAuxSinPadre.denominacion = this.rubroArticulo.denominacion
    this.serviceRubroArticulo.editar(rubroAuxSinPadre).subscribe( rubro => {
      console.log("rubro padre retirado-actualizado")
    });
  }



  //boton para volver para atras ya que se usa en admin y el cocinero
  volver() {
    this.location.back();
  }

}
