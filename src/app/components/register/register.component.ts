import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/Cliente';
import { Domicilio } from 'src/app/models/Domicilio';
import { Usuario } from 'src/app/models/usuario';
import { DomicilioService } from 'src/app/services/domicilio.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usuario: Usuario = new Usuario();
  cliente: Cliente = new Cliente();
  domicilio: Domicilio = new Domicilio();
  usuarioId!:number;
  adminId!: number;
  
  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    protected route: ActivatedRoute) { }

  ngOnInit(): void {

    this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;

    //si hay admin id -el register lo hace el admin y se agrega rol(html)
    this.adminId = +this.route.snapshot.paramMap.get('ida')!;

    //si existe usuarioId(update)traer usuario-cliente y domicilio por usuario id
    if (this.usuarioId) {
        
      this.usuarioService.ver(+this.usuarioId).subscribe( usuario =>{
        this.usuario = usuario;
        this.cliente = this.usuario.cliente;
        this.domicilio = this.usuario.cliente.domicilio;
      });

    }
    
    
  }

  registrar(){
    //asignar objetos al usuario/cliente
    this.usuario.cliente = this.cliente;
    this.usuario.cliente.domicilio =this.domicilio;

    this.usuarioService.crear(this.usuario).subscribe(user => {
      console.log("registrado con exito usuario: "+user.usuario);
      
      //si lo crea el admin vuelve al admin, sino es usuario normal y va al home
      if (this.adminId) {
        this.router.navigate(['/admin/',this.adminId]);
      }else{
        this.router.navigate(['/home/',user.cliente.id]);
      }

    })
  }

  actualizar(){
    //asignar objetos al usuario/cliente
    this.usuario.cliente = this.cliente;
    this.usuario.cliente.domicilio =this.domicilio;

    this.usuarioService.editar(this.usuario).subscribe(user => {
      console.log("actualizado con exito usuario: "+user.usuario);

      //si lo actualiza el admin vuelve al admin, sino es usuario normal y va al home
      if (this.adminId) {
        this.router.navigate(['/admin/',this.adminId]);
      }else{
        this.router.navigate(['/home/',user.cliente.id]);
      }

    })
  }

  setearRol(rol: string){
    this.usuario.rol = rol;
  }

}
