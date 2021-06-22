import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/Cliente';
import { Domicilio } from 'src/app/models/Domicilio';
import { Usuario } from 'src/app/models/usuario';
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
  usuarioId!:number;
  adminId!: number;
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
        
      this.usuarioService.ver(+this.usuarioId).subscribe( usuario =>{
        this.usuario = usuario;
        //console.log("encriptado",this.usuario.clave);
        //this.usuario.clave = (CryptoJS.AES.decrypt(this.usuario.clave.trim(), this.passCrypto)).toString(CryptoJS.enc.Utf8);
        //console.log("desencriptado",this.usuario.clave);
        this.cliente = this.usuario.cliente;
        var bytes  = CryptoJS.AES.decrypt(usuario.clave, 'teamvicious');
        this.usuario.clave = bytes.toString(CryptoJS.enc.Utf8);

        this.domicilio = this.usuario.cliente.domicilio;
      });

    }
    
    if (this.adminId) {
        
      this.usuarioService.ver(+this.adminId).subscribe( usuario =>{
        this.usuario = usuario;
        this.cliente = this.usuario.cliente;
        this.domicilio = this.usuario.cliente.domicilio;
      });

    }
  }

  registrar(){
    //asignar objetos al usuario/cliente
    this.usuario.cliente = this.cliente;
    this.usuario.cliente.email = this.usuario.usuario;
    this.usuario.cliente.domicilio =this.domicilio;
    this.usuario.rol = "user";
    //this.usuario.clave = (CryptoJS.AES.encrypt(this.usuario.clave.trim(), this.passCrypto)).toString();
    //this.usuario.clave = (CryptoJS.MD5(this.usuario.clave)).toString();
    //console.log(this.usuario.clave);

    this.usuarioService.crear(this.usuario).subscribe(user => {
      console.log("registrado con exito usuario: "+user.usuario);
      Swal.fire('CREADO!',`registrado con exito usuario: ${user.usuario}!`,'success');
      
      //si lo crea el admin vuelve al admin, sino es usuario normal y va al home
      if (this.adminId) {
        this.router.navigate(['/admin/',this.adminId]);
      }else{
        this.router.navigate(['/home/',user.id]);
      }

    })
  }

  actualizar(){
    //asignar objetos al usuario/cliente
    this.usuario.cliente = this.cliente;
    this.usuario.cliente.domicilio =this.domicilio;
    this.usuario.clave = (CryptoJS.AES.encrypt(this.usuario.clave.trim(), 'teamvicious')).toString();
    //this.usuario.clave  = CryptoJS.enc.Base64.parse('hola').toString();

    this.usuarioService.editar(this.usuario).subscribe(user => {
      console.log("actualizado con exito usuario: "+user.usuario);
      Swal.fire('ACTUALIZADO!',`actualizado con exito usuario: ${user.usuario}!`,'success');

      //si lo actualiza el admin vuelve al admin, sino es usuario normal y va al home
      if (this.adminId) {
        this.router.navigate(['/admin/',this.adminId]);
      }else{
        this.router.navigate(['/home/',user.id]);
      }

    })
  }

  setearRol(rol: string){
    this.usuario.rol = rol;
  }

}
