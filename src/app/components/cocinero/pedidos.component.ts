import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pedido } from 'src/app/models/Pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  
  Pedidos: Pedido[] = [];
  pedido: Pedido = new Pedido();
  mostrar: number = 1;
  estado!:String;
  usuarioId:any;

  constructor(
    private service: PedidoService,
    private router: Router,
    protected route: ActivatedRoute,
    private location: Location){}

  ngOnInit(): void {
    this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;

    this.listarPedido();
  
  }
 
  listarPedido(){
    this.service.listar().subscribe(pedido =>{
      this.Pedidos = pedido as Pedido[];
    })

  }

  volver() {
    this.location.back();
  }

 
  cambiarEstado(pedido:Pedido,estado:number){
    let currentUrl = this.router.url;
    pedido.estado=estado;
    this.service.editar(pedido).subscribe(pedido => {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);});
    })
  }

  mostrarEstado(numero: number){
    this.mostrar=numero;
  }

  asignarEstado(pedido:Pedido){
    if(pedido.estado===1){
      this.estado="Pendiente";
    }
    if(pedido.estado===2){
      this.estado="En Proceso";
    }
    if(pedido.estado===3){
      this.estado="Terminado";}
    }

}
