import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pedido } from 'src/app/models/Pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-listos',
  templateUrl: './listos.component.html',
  styleUrls: ['./listos.component.css']
})
export class ListosComponent implements OnInit {

  
  Pedidos: Pedido[] = [];
  pedido: Pedido = new Pedido();
  mostrar: number = 1;
  estado!:String;
  constructor(
    private service: PedidoService,
    private router: Router,
    protected route: ActivatedRoute,
    private location: Location){}

    ngOnInit(): void {

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

  asignarEstado(pedido:Pedido){
    if(pedido.estado===3){
      this.estado="Listo";}
    }

  confirmar(pedido:Pedido){
    
    if(pedido.tipoEnvio===1){
    let currentUrl = this.router.url;
      pedido.tipoEnvio=3;
      this.service.editar(pedido).subscribe(pedido => {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([currentUrl]);});
      })
    }

    if(pedido.tipoEnvio===2){
      let currentUrl = this.router.url;
        pedido.tipoEnvio=4;
        this.service.editar(pedido).subscribe(pedido => {
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([currentUrl]);});
        })
      }}
    

}

