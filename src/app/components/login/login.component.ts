import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: Usuario = new Usuario();

  constructor(private service: UsuarioService,
              private router: Router) { }

  ngOnInit(): void {
  }

  login():void{
    this.service.validarUser(this.usuario.usuario,this.usuario.clave).subscribe(user => {
      this.usuario = user;
      if (this.usuario.rol == "admin") {
        this.router.navigate(['/admin/',this.usuario.id]);
      }
      if (this.usuario.rol == "cocinero") {
        this.router.navigate(['/cocinero/',this.usuario.id]);
      }
      if (this.usuario.rol == "cajero") {
        this.router.navigate(['/cajero/',this.usuario.id]);
      }
      if (this.usuario.rol == "user") {
        this.router.navigate(['/home/',this.usuario.id]);
      }
    })
  }
}
