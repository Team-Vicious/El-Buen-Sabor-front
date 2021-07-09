

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/Cliente';
import { Domicilio } from 'src/app/models/Domicilio';
import { Usuario } from 'src/app/models/Usuario';
import { DomicilioService } from 'src/app/services/domicilio.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usuario: Usuario = new Usuario();
  cliente: Cliente = new Cliente();
  domicilio: Domicilio = new Domicilio();
  usuarioId!: number;
  adminId!: number;
  error!: any;
  validador1 = false;
  validador2 = false;
  validador3 = false;
  validador4 = false;
  //passCrypto: string = "lrisK34b";

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

      this.usuarioService.ver(+this.usuarioId).subscribe(usuario => {
        this.usuario = usuario;
        this.cliente = this.usuario.cliente;
        var bytes = CryptoJS.AES.decrypt(usuario.clave, 'teamvicious');
        this.usuario.clave = bytes.toString(CryptoJS.enc.Utf8);

        this.domicilio = this.usuario.cliente.domicilio;
      });

    }

    if (this.adminId) {

      this.usuarioService.ver(+this.usuarioId).subscribe(usuario => {
        this.usuario = usuario;
        this.cliente = this.usuario.cliente;
        var bytes = CryptoJS.AES.decrypt(usuario.clave, 'teamvicious');
        this.usuario.clave = bytes.toString(CryptoJS.enc.Utf8);
        this.domicilio = this.usuario.cliente.domicilio;
      });

    }
  }

  registrar() {


    this.usuarioService.validarUserMail(this.usuario.usuario).subscribe(user => {
      Swal.fire('El usuario ya existe!', ' ', 'error');
    }, error => {

      //asignar objetos al usuario/cliente
      try {
        this.usuario.cliente = this.cliente;
        this.usuario.cliente.email = this.usuario.usuario;
        this.usuario.cliente.domicilio = this.domicilio;
        if (this.route.snapshot.paramMap.get('ida') === null) {
          this.usuario.rol = "user";
        }
        this.usuario.clave = (CryptoJS.AES.encrypt(this.usuario.clave.trim(), 'teamvicious')).toString();

      }
      catch {
      }

      this.usuarioService.crear(this.usuario).subscribe(user => {
        console.log("registrado con exito usuario: " + user.usuario);
        Swal.fire('CREADO!', `registrado con exito usuario: ${user.usuario}!`, 'success');
        //si lo crea el admin vuelve al admin, sino es usuario normal y va al home
        if (this.adminId) {
          this.router.navigate(['/admin/', this.adminId]);
        } else {
          this.router.navigate(['/home/', user.id]);
        }
      }, err => {
        if (err.status === 400) {
          this.error = err.error;
          console.log(this.error,);
          this.validar(this.cliente);
        }
      }
      );
      this.validador1 = false;
      this.validador2 = false;
      this.validador3 = false;
    });
  }

  actualizar() {

    try {
      //asignar objetos al usuario/cliente
      this.usuario.cliente = this.cliente;
      this.usuario.cliente.domicilio = this.domicilio;
      this.usuario.clave = (CryptoJS.AES.encrypt(this.usuario.clave.trim(), 'teamvicious')).toString();
      //this.usuario.clave  = CryptoJS.enc.Base64.parse('hola').toString();
    }
    catch {
    }
    this.usuarioService.editar(this.usuario).subscribe(user => {
      console.log("actualizado con exito usuario: " + user.usuario);
      Swal.fire('ACTUALIZADO!', `actualizado con exito usuario: ${user.usuario}!`, 'success');

      //si lo actualiza el admin vuelve al admin, sino es usuario normal y va al home
      if (this.adminId) {
        this.router.navigate(['/admin/', this.adminId]);
      } else {
        this.router.navigate(['/home/', user.id]);
      }
    }, err => {
      if (err.status === 400) {
        if (this.validarEmail(this.usuario)) {
          Swal.fire('Error', `La dirección de correo no es correcta`, 'error');
        }
        else {
          this.error = err.error;
          console.log(this.error,);
          Swal.fire('Error', `Hay campos incompletos o incorrectos
        <br> Por favor rellene adecuadamente los campos. `, 'error');
        }
      }
    }
    );



  }




  setearRol(rol: string) {
    this.usuario.rol = rol;
  }

  validar(cliente: Cliente) {

    if (!cliente.nombre) {
      this.validador1 = true;
    }
    if (!cliente.apellido) {
      this.validador2 = true;
    }
    if (!cliente.telefono) {
      this.validador3 = true;
    }

  }

  validarEmail(usuario: Usuario) {
    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(usuario.usuario)) {
      return false;
    } else {
      return true;
    }
  }



}