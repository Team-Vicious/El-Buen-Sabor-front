import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pedido } from 'src/app/models/Pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { Location } from '@angular/common';
import { Factura } from 'src/app/models/Factura';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfMake from "pdfmake/build/pdfmake";
import { DetalleFactura } from 'src/app/models/DetalleFactura';
import { FacturaService } from 'src/app/services/factura.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

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
  usuarioId!:any;

  constructor(
    private pedidoService: PedidoService,
    private facturaService: FacturaService,
    private router: Router,
    protected route: ActivatedRoute,
    private location: Location){}

    ngOnInit(): void {
      this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;

      this.listarPedido();
  
    }
 
  listarPedido(){
    this.pedidoService.listar().subscribe(pedido =>{
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
      this.pedidoService.editar(pedido).subscribe(pedido => {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([currentUrl]);});
      })
    }

    if(pedido.tipoEnvio===2){
      let currentUrl = this.router.url;
        pedido.tipoEnvio=4;
        this.pedidoService.editar(pedido).subscribe(pedido => {
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([currentUrl]);});
        })
    }
  }

  //generar factura pdf
  factura!: Factura;
  generatePdf(pedido: Pedido){
      const documentDefinition = this.getDocumentDefinition(pedido);
      pdfMake.createPdf(documentDefinition).open();
  }

  getDocumentDefinition(pedido: Pedido) {

    return {
      
      content: [
        '\n [ EL BUEN SABOR ]',
        `\nPEDIDO NROº ${pedido.numero}`,
        `fecha del depido: ${pedido.fecha}`,
        `Tipo de envio: ${pedido.tipoEnvio == 1? 'delivery': 'retiro en el local'}`,
        `\n FACTURA NROº ${pedido.factura.numero}`,
        `fecha de la factura: ${pedido.factura.fecha}`,
        `Monto de descuento: ${pedido.factura.montoDescuento}`,
        `Forma de pago: ${pedido.factura.formaPago? 'Mercado Pago' : 'Contado'}`,
        `Nro Tarjeta: ${pedido.factura.nroTarjeta}`,
        `\n\bDETALLE:\b${pedido.factura.detalleFactura.map((det:DetalleFactura) => {

          return `\n${det.articuloManofacturado.denominacion} === (cantidad: ${det.cantidad}) === [Sub-Total $${det.cantidad*det.articuloManofacturado.precioVenta}]`; 

        })}`,
        `\n ==[Total: $${pedido.factura.totalVenta}]===`
      ] 
    };
  }

  eliminarFactura(pedido: Pedido){
    //dar bajado logico, porque puede dar error al eliminar por su fk que se utiliza en pedido
    //this.facturaService.eliminar(pedido.factura.id).subscribe( factura =>{
      
      console.log("factura eliminada con exito!");
    //}
    //)
  }
    

}

