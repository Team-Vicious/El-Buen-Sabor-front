import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pedido } from 'src/app/models/Pedido';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  
  Pedidos: Pedido[] = [];
  pedido: Pedido = new Pedido();
  constructor(
    private service: PedidoService,
    private router: Router,
    protected route: ActivatedRoute) { }

    ngOnInit(): void {

      this.listarPedido();
  
    }
 
  listarPedido(){
    this.service.listar().subscribe(pedido =>{
      this.Pedidos = pedido as Pedido[];
    })
  }

 
  cambiarEstado(pedido:Pedido,estado:number){
    let currentUrl = this.router.url;
    pedido.estado=estado;
    this.service.editar(pedido).subscribe(pedido => {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);});
    })
  
    

  }



}
