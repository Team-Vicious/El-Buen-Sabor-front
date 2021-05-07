import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloInsumo } from 'src/app/models/ArticuloInsumo';
import { ArticuloManofacturado } from 'src/app/models/ArticuloManofacturado';
import { Usuario } from 'src/app/models/usuario';
import { ArticuloInsumoService } from 'src/app/services/articuloInsumo.service';
import { ArticuloManofacturadoService } from 'src/app/services/articuloManofacturado.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  adminId!:number;

  constructor(
    private usuarioService: UsuarioService,
    private articuloManofacturadoService: ArticuloManofacturadoService,
    private articuloInsumoService: ArticuloInsumoService,
    private router: Router,
    protected route: ActivatedRoute) { }

  ngOnInit(): void {
    this.adminId = +this.route.snapshot.paramMap.get('idu')!;
  }

  listarUsuario:boolean = false;
  usuarios: Usuario[] = [];
  listarUsuarios(){
    this.usuarioService.listar().subscribe(usuarios =>{
      this.listarUsuario = true;
      this.listarArticuloManofacturado = false;
      this.listarArticuloInsumo = false;
      this.usuarios = usuarios as Usuario[];
    })
  }

  editarUsuario(usuarioId: number){
    
    this.router.navigate(['update/',usuarioId,'admin',this.adminId]);
  }

  eliminarUsuario(usuarioId: number){
    this.usuarioService.eliminar(usuarioId).subscribe(usuario =>{
      console.log("usuario eliminado: ",usuario);
    })
    this.router.navigate(['admin/',this.adminId]);
    //para actualizar la vista
    this.listarUsuarios();
  }

  listarArticuloManofacturado:boolean = false;
  ArticuloManofacturado: ArticuloManofacturado[] = [];
  listarArticuloManofacturados(){
    this.articuloManofacturadoService.listar().subscribe(articulos =>{
      this.listarArticuloManofacturado = true;
      this.listarUsuario = false;
      this.listarArticuloInsumo = false;
      this.ArticuloManofacturado = articulos as ArticuloManofacturado[];
    })
  }

  listarArticuloInsumo:boolean = false;
  ArticuloInsumo: ArticuloInsumo[] = [];
  listarArticuloInsumos(){
    this.articuloInsumoService.listar().subscribe(articulos =>{
      this.listarArticuloInsumo = true;
      this.listarArticuloManofacturado = false;
      this.listarUsuario = false;
      this.ArticuloInsumo = articulos as ArticuloInsumo[];
    })
  }

  eliminarInsumo(insumoId: number){
    this.articuloInsumoService.eliminar(insumoId).subscribe(insumo =>{
      console.log("usuario eliminado: ",insumo);
    })
    this.router.navigate(['admin/',this.adminId]);
    //para actualizar la vista
    this.listarArticuloInsumos();
  }

}
