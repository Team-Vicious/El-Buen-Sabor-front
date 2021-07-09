import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidosComponent } from 'src/app/components/cocinero/pedidos.component';
import { Pedido } from 'src/app/models/Pedido';
import { Usuario } from 'src/app/models/Usuario';
import { PedidoService } from 'src/app/services/pedido.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfMake from "pdfmake/build/pdfmake";
import { DetalleFactura } from 'src/app/models/DetalleFactura';
import { Factura } from 'src/app/models/Factura';
import { FacturaService } from 'src/app/services/factura.service';

//import pdfFonts from 'pdfmake/build/vfs_fonts';
//import pdfMake from "pdfmake/build/pdfmake";
//var pdfMake = require('pdfmake/build/pdfmake.js');
//var pdfFonts = require('pdfmake/build/vfs_fonts.js');
//pdfMake.vfs = pdfFonts.pdfMake.vfs;
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-historial-pedidos',
  templateUrl: './historial-pedidos.component.html',
  styleUrls: ['./historial-pedidos.component.css']
})
export class HistorialPedidosComponent implements OnInit {

  constructor(
    protected pedidoService: PedidoService,
    protected facturaService: FacturaService,
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

  //generar factura pdf
  factura!: Factura;
  generatePdf(pedido: Pedido){
      var auxPedido = new Pedido();
      
      const documentDefinition = this.getDocumentDefinition(pedido);
      pdfMake.createPdf(documentDefinition).open();
      
  }

  

  getDocumentDefinition(pedido: Pedido) {
    
    return {
      
      content: [
        '\n [ EL BUEN SABOR ]',
        `\nPEDIDO NROº ${pedido.numero}`,
        `fecha del depido: ${pedido.fecha}`,
        `Tipo de envio: ${pedido.tipoEnvio == 1? 'retiro en el local':pedido.tipoEnvio == 2? 'delivery': ""}`,
        `\n FACTURA NROº ${pedido.factura.numero}`,
        `fecha de la factura: ${pedido.factura.fecha}`,
        `Monto de descuento: ${pedido.factura.montoDescuento > 0? `Retiro en el local 10% de descuento: ( -$${pedido.factura.montoDescuento} )` : 'no hay descuento'}`,
        `Forma de pago: ${pedido.factura.formaPago == 'Contado'? 'Contado' : 'Mercado Pago'}`,
        `Nro Tarjeta: ${pedido.factura.nroTarjeta}`,
        `\n\bDETALLE:\b${pedido.factura.detalleFactura.map((det:DetalleFactura) => {

          if(det.articuloManofacturado){
            return `\n${det.articuloManofacturado.denominacion} === (cantidad: ${det.cantidad}) === [Sub-Total $${det.cantidad*det.articuloManofacturado.precioVenta}]`; 

          }
          if(det.articuloInsumo){
            return `\n${det.articuloInsumo.denominacion} === (cantidad: ${det.cantidad}) === [Sub-Total $${det.cantidad*det.articuloInsumo.precioVenta}]`; 

          }
          return "";


        })}`,
        `\n ==[Total: $${pedido.factura.totalVenta}]===`
      ] 
    };
  }

}
