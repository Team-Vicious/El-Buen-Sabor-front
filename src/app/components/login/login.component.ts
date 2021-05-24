import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { Cliente } from 'src/app/models/Cliente';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { envelopeOpenFill } from 'ngx-bootstrap-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  usuario!: Usuario;
  user!: string;
  clave!: string;
  socialUser!: SocialUser;
  userLogged!: SocialUser;
  isLogged!: boolean;
  passCrypto: string = "lrisK34b";

  constructor(
    private service: UsuarioService,
    private router: Router,
    private authService: SocialAuthService) { }


  ngOnInit(): void {
    //verificar si estoy logueado
    this.authService.authState.subscribe(data => {
      this.userLogged = data;
      this.isLogged = (this.userLogged != null);
    })
  }

  //validar rol
  login() {
    //const hashcode = CryptoJS.MD5(CryptoJS.enc.Latin1.parse("aaa")).toString();
    //var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Latin1.parse("aaa"), "Secret Passphrase").toString();
    //var encrypted = CryptoJS.AES.encrypt("aaaa", "Secret Passphrase");
    //var encrypted = CryptoJS.DES.encrypt("aaa", "Ss").toString();
    //console.log(encrypted);
    // convert String to WordArray
    //var wordArray = CryptoJS.enc.Utf8.parse('Hello, World!').toString();

    // convert WordArray To String
    //var result1=wordArray.toString(CryptoJS.enc.Utf8);
    //var result2=CryptoJS.enc.Utf8.stringify(wordArray);

    //console.log(CryptoJS.enc.Utf8.stringify(hashcode));
    //console.log(result1);
    //console.log(result2);
    //console.log(result1===result2);
      
      this.service.validarUser(this.user, this.clave).subscribe(user => {
        try {
          this.usuario = user;
          
          if (this.usuario.rol == "admin") {
            this.router.navigate(['/admin/', this.usuario.id]);
          }
          if (this.usuario.rol == "cocinero") {
            this.router.navigate(['/cocinero/', this.usuario.id]);
          }
          if (this.usuario.rol == "cajero") {
            this.router.navigate(['/cajero/', this.usuario.id]);
          }
          if (this.usuario.rol == "user") {
            this.router.navigate(['/home/', this.usuario.id]);
          }
          if (this.usuario.rol == "userg") {
            this.router.navigate(['/home/', this.usuario.id]);
          }
        } catch (error) {
          Swal.fire('INCORRECTO!','usuario o contraseña incorrectos! <br> Si no esta registrado, por favor registrese!','error');
        }
      }, err => {
        console.log(err)
        
    });
    

  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
      this.socialUser = data;
      this.isLogged = true;

      //intertar buscar en la db el user y contraseña, en caso contrario hacer un register del usuario
      //usuario=nombre de google y la contraseña sera email de google 
      try {
        //loguear
        this.service.validarUser(this.socialUser.name, this.socialUser.email).subscribe(user => {
          this.usuario = user;
          //si puede traer el usuario que redireccione
          if (this.usuario) {

            this.router.navigate(['/home/', this.usuario.id]);
          } else {

            //registrar/crear el objeto y asignarle los atributos
            var usuarioAux: Usuario = new Usuario();
            var clienteAux: Cliente = new Cliente();
            usuarioAux.usuario = this.socialUser.name;
            usuarioAux.clave = this.socialUser.email;
            usuarioAux.rol = "userg";
            clienteAux.nombre = this.socialUser.firstName;
            clienteAux.apellido = this.socialUser.lastName;
            clienteAux.email = this.socialUser.email;
            usuarioAux.cliente = clienteAux;

            this.service.crear(usuarioAux).subscribe(user => {
              this.usuario = user;

              Swal.fire({
                title: 'Logueado con exito!',
                text: `ahora solo queda ingresar su domicilio!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok, llenar!',
                cancelButtonText: 'Acerlo mas tarde'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/updateDomicilio/', this.usuario.id]);
                }else{
                  this.router.navigate(['/home/', this.usuario.id]);
                }
              });

            });
            
          }
          


        });

      } catch (error) {

        console.log("no se pudo loguear ni registrar con google", error);
        Swal.fire('ERROR!','No se pudo registrar con google','warning');
      }

      //cerrar sesion
      this.signOut();
    });

  }

  signOut(): void {
    this.authService.signOut();
  }
}
