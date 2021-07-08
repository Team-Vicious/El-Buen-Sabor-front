import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/Cliente';
import { Domicilio } from 'src/app/models/Domicilio';
import { Usuario } from 'src/app/models/Usuario';
import { DomicilioService } from 'src/app/services/domicilio.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-domicilio-form',
  templateUrl: './domicilio-form.component.html',
  styleUrls: ['./domicilio-form.component.css']
})
export class DomicilioFormComponent implements OnInit {

  usuarioId!:number;
  usuario!: Usuario;
  cliente: Cliente = new Cliente();
  domicilio: Domicilio = new Domicilio();
  

  constructor(
    private usuarioService: UsuarioService,
    private domicilioService: DomicilioService,
    private router: Router,
    protected route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    
    this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;

    if (this.usuarioId) {
      this.usuarioService.ver(+this.usuarioId).subscribe( usuario =>{
        this.usuario = usuario;

        if(usuario.cliente.domicilio){

          //this.domicilio = this.usuario.cliente.domicilio;
          
          
          //traer el domicilio
          this.domicilioService.findDomicilioPorClienteId(this.usuario.cliente.id).subscribe( domicilio =>{
            this.domicilio = domicilio;
            this.usuario.cliente.domicilio = this.domicilio;
          });
        }
        
        
      });


    }
      
    
  }

  actualizar(){
    //asignar objetos al usuario/domicilio
    //this.usuario.cliente = this.cliente;
    this.usuario.cliente.domicilio =this.domicilio;

    this.usuarioService.crear(this.usuario).subscribe(user => {
      console.log("actualizado con exito domicilio: ",this.domicilio.calle);
      
      //si lo crea el admin vuelve al admin, sino es usuario normal y va al home
      
      this.router.navigate(['/home/',user.id]);
      

    })
  }

  volver() {
    this.location.back();
  }

}
