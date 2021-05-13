import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pedido } from 'src/app/models/Pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { Factura } from 'src/app/models/Factura';
import { FacturaService } from 'src/app/services/factura.service';
import { DetalleFactura } from 'src/app/models/DetalleFactura';
import { DetalleFacturaService } from 'src/app/services/detalleFactura.service';

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
  
  constructor(
    private service: PedidoService,
    private serviceFactura: FacturaService,
    private serviceDetalleFactura: DetalleFacturaService,
    private router: Router,
    protected route: ActivatedRoute) { }

    ngOnInit(): void {
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

   
    

}
