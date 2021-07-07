import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Factura } from 'src/app/models/Factura';
import { Pedido } from 'src/app/models/Pedido';
import { FacturaService } from 'src/app/services/factura.service';
import { PedidoService } from 'src/app/services/pedido.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { DetalleFactura } from 'src/app/models/DetalleFactura';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {

  factura: Factura = new Factura();
  listaPedidos: Pedido[] = [];
  pedido!: Pedido;
  error: any;
  usuarioId!: any;
  botonIngVisible: boolean = false;

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
        this.factura = factura;
        this.servicePedido.getPedidoByFacturaId(this.factura.id).subscribe(pedido => {
          this.pedido = pedido;
        });
      });
    }

    this.servicePedido.listar().subscribe(pedidos => {
      this.listaPedidos = pedidos as Pedido[];
      console.log(this.listaPedidos)
    });
  }

  asignarPedido(pedido: Pedido) {
    //selecciono el pedido al que le quiero asignar la factura
    this.pedido = pedido;


  }

  //persisto la factura asignandola la pedido como un update
  persistirFactura() {
    if (this.factura.totalVenta && this.factura.totalVenta != undefined && this.pedido &&
      this.factura.formaPago != undefined) {


      this.factura.fecha = new Date();

      let facturaId = +this.route.snapshot.paramMap.get('idf')!;
      if (!facturaId) {


        //calcular precioCosto y detalles
        //asigno total costo a la factura
        var totalCosto: number = 0;

        //recorro detalle pedido(articulosManufacturados o insumo)
        this.pedido.detallePedido.map(detallePedido => {

          //creo detalle de la factura y se los asigno para manufacturado o insumo
          var detalleFactura: DetalleFactura = new DetalleFactura();

          //si tiene articulo Manufacturado
          if (detallePedido.articuloManofacturado) {
            detalleFactura.articuloManofacturado = detallePedido.articuloManofacturado;
            detalleFactura.cantidad = detallePedido.cantidad;
            detalleFactura.subTotal = detallePedido.subTotal;
            this.factura.detalleFactura.push(detalleFactura);

            //recorro el detalle del articulo Manufacturado para acumular el costo
            detallePedido.articuloManofacturado.articuloManofacturadoDetalle.map(detalleArticulo => {

              //acumulo el precio de los insumos del detalle del manufacturado
              totalCosto += ((detalleArticulo.articuloInsumo.precioCompra) * detalleArticulo.cantidad);
            });
          }

          //si tiene Insumo
          if (detallePedido.articuloInsumo) {
            detalleFactura.articuloInsumo = detallePedido.articuloInsumo;
            detalleFactura.cantidad = detallePedido.cantidad;
            detalleFactura.subTotal = detallePedido.subTotal;
            this.factura.detalleFactura.push(detalleFactura);

            //de paso acumulo al total el precioCosto de la bebida
            totalCosto += detallePedido.articuloInsumo.precioCompra;
          }


          this.factura.totalCosto = totalCosto;
        });


      }
      //asigno descuento
      this.factura.totalVenta = (this.factura.totalVenta - this.factura.montoDescuento);

      //asigno la factura al pedido
      this.pedido.factura = this.factura;

      this.pedido.total = this.pedido.factura.totalVenta;

      this.servicePedido.editar(this.pedido).subscribe(pedido => {
        pedido.factura.numero = pedido.factura.id;
        this.serviceFactura.editar(pedido.factura).subscribe(factura => {

          Swal.fire('OK', `FACTURA CREADA Y ASIGNADA CON EXITO!`, 'success');
          this.volver();
        });
      });
    }else{
      Swal.fire('ERROR', `Faltan llenar campos!`, 'error');
    }
  }

  formaPago: string = "";
  asignarFormaPago(formaPago: string) {
    this.factura.formaPago = formaPago;
    this.formaPago = formaPago;
  }

  volver() {
    this.location.back();
  }

}
