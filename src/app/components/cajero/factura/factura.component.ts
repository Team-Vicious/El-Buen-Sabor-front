import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Factura } from 'src/app/models/Factura';
import { Pedido } from 'src/app/models/Pedido';
import { FacturaService } from 'src/app/services/factura.service';
import { PedidoService } from 'src/app/services/pedido.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {

  factura:Factura = new Factura();
  listaPedidos:Pedido[] = [];
  pedido!: Pedido;
  error:any;
  usuarioId!:any;

  constructor(
    private servicePedido: PedidoService,
    private serviceFactura: FacturaService,
    private router: Router,
    protected route: ActivatedRoute,
    private location: Location) { }

  ngOnInit(): void {
    this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;

    
    let facturaId = +this.route.snapshot.paramMap.get('idf')!;
    if (facturaId) {
      
      this.serviceFactura.ver(facturaId).subscribe(factura => {
        this.factura =factura;
      });
    }

    this.servicePedido.listar().subscribe( pedidos => {
      this.listaPedidos = pedidos as Pedido[];
      console.log(this.listaPedidos)
    });
  }

  asignarPedido(pedido: Pedido){
    //selecciono el pedido al que le quiero asignar la factura
    this.pedido = pedido;

    //asigno la factura al pedido
    this.pedido.factura = this.factura;
  }

  //persisto la factura asignandola la pedido como un update
  persistirFactura(){
    this.factura.fecha = new Date();
    this.servicePedido.editar(this.pedido).subscribe( pedido =>{
      Swal.fire('OK', `FACTURA CREADA Y ASIGNADA CON EXITO!`, 'success');
      this.volver();
    });
  }

  formaPago:string = "";
  asignarFormaPago(formaPago:string){
    this.factura.formaPago = formaPago;
    this.formaPago = formaPago;
  }

  volver() {
    this.location.back();
  }

}
