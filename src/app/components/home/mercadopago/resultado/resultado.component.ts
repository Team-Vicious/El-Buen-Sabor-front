import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pedido } from 'src/app/models/Pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { Usuario } from 'src/app/models/Usuario';
import { MercadopagoDatos } from 'src/app/models/MercadopagoDatos';
import { MercadopagoDatosService } from 'src/app/services/mercadopagoDatos.service';
import { ArticuloInsumoService } from 'src/app/services/articuloInsumo.service';
import { ArticuloManofacturadoService } from 'src/app/services/articuloManofacturado.service';
<<<<<<< HEAD
import { ArticuloInsumo } from 'src/app/models/ArticuloInsumo';
import { DetallePedido } from 'src/app/models/DetallePedido';
import { mergeMap, switchMap, switchMapTo } from 'rxjs/operators';
import { empty, observable } from 'rxjs';
import { Observable } from 'rxjs';
=======
import { DetallePedido } from 'src/app/models/DetallePedido';
import { ArticuloInsumo } from 'src/app/models/ArticuloInsumo';
>>>>>>> issueJoaquin

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css']
})
export class ResultadoComponent implements OnInit {

  constructor(
    protected mercadopagoService: MercadopagoDatosService,
    protected pedidoService: PedidoService,
    protected insumoService: ArticuloInsumoService,
    protected router: Router,
    protected route: ActivatedRoute
  ) { }

  usuarioId!: number;
  pedidoId!: number;
  resultado!: string;
  pedido!: Pedido;
  insumo!: ArticuloInsumo;

  ngOnInit(): void {
    this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;
    this.pedidoId = +this.route.snapshot.paramMap.get('idp')!;
    this.resultado = this.route.snapshot.paramMap.get('resultado')!;


    this.pedidoService.ver(this.pedidoId).subscribe(pedido => {
      this.pedido = pedido;


      //actualiar el tipo de pago para mp
      this.tipoPago();

      //reducir stock si el pedido es exitoso
      if (this.resultado == "exitoso") {


        //recorro detalles del pedido
        this.pedido.detallePedido.map(detalle => {

          //comidas
          if (detalle.articuloManofacturado) {

            //recorro los detalles del articulo manufacturado
            detalle.articuloManofacturado.articuloManofacturadoDetalle.map(manufDetalle => {

              this.traerInsumo(manufDetalle.articuloInsumo.id, manufDetalle.cantidad);

            });

          }

          //bebidas
          if (detalle.articuloInsumo) {
            detalle.articuloInsumo.stockActual = detalle.articuloInsumo.stockActual - 1;

            //obtengo el articulo insumo del pedido y los paso con el stock reducido al editar
            this.insumoService.editar(detalle.articuloInsumo).subscribe(insumo => {
              console.log("insumo bebida reducido");
            });
          }
          


        })


      }
    });

  }

  traerInsumo(id: number, cantidad: number) {
    //traer el articulo insumo actualizado
    var insumoAux;
    this.insumoService.verNuevo(id).subscribe(insumo => {
      insumo.stockActual = insumo.stockActual - cantidad;
      insumoAux = insumo;

      this.actualizarInsumo(insumoAux);
    });

  }

  actualizarInsumo(insumoAux: ArticuloInsumo) {
    this.insumoService.editarNuevo(insumoAux).subscribe(insumo => {
      console.log("stock reducido: ", insumo.denominacion, " cantidad: ", insumo.stockActual);
    });
  }


  tipoPago() {

    var mercadoP: MercadopagoDatos;

    mercadoP = this.pedido.mercadopagoDatos;

    //si tiene mp estonces fue pagado con mp, sino fue pagado de contado retiro en local
    if (this.pedido.mercadopagoDatos) {

      //indica el metodo del pago depende el resultado
      //this.pedido.mercadopagoDatos.metodoPago = "1" //1 tarjeta o transferencia - 2 rapipago/pagofacil - 3 sin pagar error 
      //actualizar mp con el tipo de pago
      //this.pedido.mercadopagoDatos.estado = "1";//0 sin pagar, 1 pagado, 2 pendiente
      if (this.resultado == "exitoso") {
        mercadoP.metodoPago = "1";
        mercadoP.estado = "1";
        mercadoP.fechaAprobacion = new Date();
        mercadoP.identidicadorPago = this.pedido.mercadopagoDatos.id;
        mercadoP.metodoPago = "Tarjeta MP";
        mercadoP.nroTarjeta = "5031 7557 3453 0604";

      }

      if (this.resultado == "pendiente") {
        mercadoP.metodoPago = "2";
        mercadoP.estado = "0";
        mercadoP.metodoPago = "RapiPago-PagoFacil";
        mercadoP.identidicadorPago = this.pedido.mercadopagoDatos.id;
      }

      if (this.resultado == "error") {
        mercadoP.metodoPago = "3";
        mercadoP.estado = "0";
      }

      //persistir***********
      //primero persisto mp y luego se lo asigno al pedido, lo hago asi
      //porque por algun bug misterioso si lo hago de otra forma da error
      this.mercadopagoService.editar(mercadoP).subscribe(mm => {
        this.pedido.mercadopagoDatos = mm;
        this.pedido.factura.nroTarjeta = "5031 7557 3453 0604";
        this.pedidoService.editar(this.pedido).subscribe(p => {
          console.log("pedido actualizado con exito");

          //enviar mail
          this.pedidoService.postEmail(p).subscribe(ped => {
            console.log(ped);
          });

        });
      })

      /*
      //persistir***********
      this.pedidoService.editar(this.pedido).subscribe( pedido => {
        console.log("pedido actualizado",pedido.id);

        
      });
      */
    }
  }

}
