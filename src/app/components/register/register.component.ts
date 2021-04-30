import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/models/Cliente';
import { Domicilio } from 'src/app/models/Domicilio';
import { Usuario } from 'src/app/models/usuario';
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
  
  constructor(
    private service: UsuarioService,
    private router: Router) { }

  ngOnInit(): void {
  }

  registrar(){
    //asignar objetos al usuario/cliente
    this.usuario.cliente = this.cliente;
    this.usuario.cliente.domicilio =this.domicilio;

    this.service.crear(this.usuario).subscribe(user => {
      console.log("registrado con exito usuario: "+user.usuario);
      this.router.navigate(['/home/',user.cliente.id]);

    })
  }

}
