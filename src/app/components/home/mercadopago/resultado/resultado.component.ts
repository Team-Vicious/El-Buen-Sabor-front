import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pedido } from 'src/app/models/Pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { Usuario } from 'src/app/models/Usuario';
import { MercadopagoDatos } from 'src/app/models/MercadopagoDatos';
import { MercadopagoDatosService } from 'src/app/services/mercadopagoDatos.service';
import { ArticuloInsumoService } from 'src/app/services/articuloInsumo.service';
import { ArticuloManofacturadoService } from 'src/app/services/articuloManofacturado.service';
import { DetallePedido } from 'src/app/models/DetallePedido';
import { ArticuloInsumo } from 'src/app/models/ArticuloInsumo';

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
    //this.resultado = this.route.snapshot.paramMap.get('pendiente')!;
    //this.resultado = this.route.snapshot.paramMap.get('error')!;
    
    this.pedidoService.ver(this.pedidoId).subscribe(pedido => {
      this.pedido = pedido;

      var arrAuxDetalle:DetallePedido[] = [];
      var arrCopiaDetallePedido = pedido.detallePedido;
      //calcular cantidad detalle
      arrCopiaDetallePedido.map(det => {
        //creo variables desde 0
        var detalleAux:DetallePedido = det;
        var cantidad = 0;
        var i: number = 0;

        //recorro para ver si se repite
        arrCopiaDetallePedido.map(det2 => {

          if(det.articuloManofacturado.id == det2.articuloManofacturado.id){
            cantidad = cantidad + 1;
          }
        });

        //seteo la cantidad y hago un push al arreglo de detalles
        det.cantidad = cantidad;
        arrAuxDetalle.push(det);
        
        arrCopiaDetallePedido.splice(i,1);
        //borro el detalle del arr
        i++;
        /*
        eliminarInsumoDelCarro(id: number) {
          var i: number = 0;
          this.articuloInsumoCarrito.map(articulo => {
            if (articulo.id == id) {
              this.articuloInsumoCarrito.splice(i, 1)
            }
           i++;
          })
        }
        */
        console.log(cantidad)
      });

      //muestro los datos
      arrAuxDetalle.map( d => {

        console.log(d.articuloManofacturado.denominacion,"cantidad ",d.cantidad);
      });
      
      
      //actualiar el tipo de pago para mp
      this.tipoPago();

      //reducir stock si el pedido es exitoso
      if(this.resultado == "exitoso"){

        
        //recorro detalles del pedido
        arrAuxDetalle.map( detalle => {
          //console.log("paso 1 detalle pedido");
          
          
          if(detalle.articuloManofacturado){

            //recorro los detalles del articulo manufacturado
            detalle.articuloManofacturado.articuloManofacturadoDetalle.map( manufDetalle => {
              //console.log("paso 2 trae detalle manuf");
              //this.traerXActualizarInsumo(manufDetalle.articuloInsumo.id,manufDetalle.cantidad);

              
              //traer el articulo insumo actualizado
               this.insumoService.ver(manufDetalle.articuloInsumo.id).subscribe( insumo => {
                this.insumo = insumo; 
                //console.log("paso 3 trae insumo ",insumo.denominacion);
                this.insumo.stockActual = this.insumo.stockActual - (manufDetalle.cantidad * detalle.cantidad);

                
                
                //actualizo el articulo insumo
                this.insumoService.editar(this.insumo).subscribe( insum =>{
                  //console.log("paso 4 actualiza insumo ",insum.denominacion);
                  console.log("stock reducido: ",insum.denominacion," cantidad: ",insum.stockActual);
                }); 
                
              });
            });  
          }
          
          if(detalle.articuloInsumo){
            detalle.articuloInsumo.stockActual = detalle.articuloInsumo.stockActual -1;
            
            //obtengo el articulo insumo del pedido y los paso con el stock reducido al editar
            this.insumoService.editar(detalle.articuloInsumo).subscribe( insumo =>{
              console.log("insumo bebida reducido");
            }); 
          }
          

        })

        
      }
    });

  }

  tipoPago(){

    var mercadoP: MercadopagoDatos;

    mercadoP = this.pedido.mercadopagoDatos;

    //si tiene mp estonces fue pagado con mp, sino fue pagado de contado retiro en local
    if(this.pedido.mercadopagoDatos){

      //indica el metodo del pago depende el resultado
      //this.pedido.mercadopagoDatos.metodoPago = "1" //1 tarjeta o transferencia - 2 rapipago/pagofacil - 3 sin pagar error 
      //actualizar mp con el tipo de pago
      //this.pedido.mercadopagoDatos.estado = "1";//0 sin pagar, 1 pagado, 2 pendiente
      if(this.resultado == "exitoso"){
        mercadoP.metodoPago = "1";
        mercadoP.estado = "1";
        mercadoP.fechaAprobacion = new Date();
        mercadoP.identidicadorPago = this.pedido.mercadopagoDatos.id;
        mercadoP.metodoPago = "Tarjeta MP";
        mercadoP.nroTarjeta = "5031 7557 3453 0604";
        
      }
      
      if(this.resultado == "pendiente"){
        mercadoP.metodoPago = "2";
        mercadoP.estado = "0";
        mercadoP.metodoPago = "RapiPago-PagoFacil";
        mercadoP.identidicadorPago = this.pedido.mercadopagoDatos.id;
      }

      if(this.resultado == "error"){
        mercadoP.metodoPago = "3";
        mercadoP.estado = "0";
      }

      //persistir***********
      //primero persisto mp y luego se lo asigno al pedido, lo hago asi
      //porque por algun bug misterioso si lo hago de otra forma da error
      this.mercadopagoService.editar(mercadoP).subscribe( mm => {
        this.pedido.mercadopagoDatos = mm;
        this.pedido.factura.nroTarjeta = "5031 7557 3453 0604";
        this.pedidoService.editar(this.pedido).subscribe( p => {
          console.log("pedido actualizado con exito");

          //enviar mail
          this.pedidoService.postEmail(p).subscribe(ped =>{
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
