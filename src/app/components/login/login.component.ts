import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { Cliente } from 'src/app/models/Cliente';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

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
    this.service.validarUser(this.user, this.clave).subscribe(user => {
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
            usuarioAux.rol = "user";
            clienteAux.nombre = this.socialUser.firstName;
            clienteAux.apellido = this.socialUser.lastName;
            clienteAux.email = this.socialUser.email;
            usuarioAux.cliente = clienteAux;

            this.service.crear(usuarioAux).subscribe(user => {
              this.usuario = user;

              Swal.fire({
                title: 'Logueado con exito!',
                text: `ahora solo queda llenar el formulario con los datos`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok, llenar!',
                cancelButtonText: 'Acerlo mas tarde'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/update/', this.usuario.id]);
                }else{
                  this.router.navigate(['/home/', this.usuario.id]);
                }
              });

            });
            
          }
          


        });

      } catch (error) {

        console.log("no se pudo loguear ni registrar con google", error);
      }

      //cerrar sesion
      this.signOut();
    });

  }

  signOut(): void {
    this.authService.signOut();
  }
}
