import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidosComponent } from 'src/app/components/cocinero/pedidos.component';
import { Pedido } from 'src/app/models/Pedido';
import { Usuario } from 'src/app/models/usuario';
import { PedidoService } from 'src/app/services/pedido.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-historial-pedidos',
  templateUrl: './historial-pedidos.component.html',
  styleUrls: ['./historial-pedidos.component.css']
})
export class HistorialPedidosComponent implements OnInit {

  constructor(
    protected pedidoService: PedidoService,
    protected usuarioService: UsuarioService,
    protected router: Router,
    protected route: ActivatedRoute
    ) { }

  usuarioId!: number;
  usuario!: Usuario;
  listaPedidos!: any;

  ngOnInit(): void {
    //trae usuario
    this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;
    this.usuarioService.ver(this.usuarioId).subscribe(usuario => {
      this.usuario = usuario;

      //trae pedidos
      this.pedidoService.getPedidosByClienteId(this.usuario.cliente.id).subscribe( pedidos =>{
        this.listaPedidos = pedidos as Pedido[];
      });
    });

  }

  //pasar imagenes de bytes a img
  formatImage(img: any): any {
    return 'data:image/jpeg;base64,' + img;
  }

}
