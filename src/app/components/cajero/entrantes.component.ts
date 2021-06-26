import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pedido } from 'src/app/models/Pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-entrantes',
  templateUrl: './entrantes.component.html',
  styleUrls: ['./entrantes.component.css']
})
export class EntrantesComponent implements OnInit {

  Pedidos: Pedido[] = [];
  pedido: Pedido = new Pedido();
  mostrar: number = 1;
  estado!:String;
  usuarioId!:any;
  
  constructor(
    private service: PedidoService,
    private router: Router,
    protected route: ActivatedRoute,
    private location: Location){}

    ngOnInit(): void {
      this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;
      this.mostrar=0;
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

  mostrarEstado(numero: number){
    this.mostrar=numero;
  }

  volver() {
    this.location.back();
  }

  asignarEstado(pedido:Pedido){
    if(pedido.estado===0){
      this.estado="Entrante";
    }
    if(pedido.estado===1){
      this.estado="Aceptado";
    }
    if(pedido.estado===5){
      this.estado="Cancelado";}
    }

   
    borrarPedido(pedido:Pedido){
      let currentUrl = this.router.url;
      pedido.fechaBaja= new Date();
      pedido.detallePedido.forEach(detalle => {
        detalle.fechaBaja=new Date();
      });
      this.service.editar(pedido).subscribe(pedido => {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);});
    })

     
      }
  

}
