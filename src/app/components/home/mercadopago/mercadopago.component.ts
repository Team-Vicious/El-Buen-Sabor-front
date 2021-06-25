import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pedido } from 'src/app/models/Pedido';
import { MercadopagoDatosService } from 'src/app/services/mercadopagoDatos.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/Usuario';
import { MercadopagoDatos } from 'src/app/models/MercadopagoDatos';

declare var abrirCheckout: any;

@Component({
  selector: 'app-mercadopago',
  templateUrl: './mercadopago.component.html',
  styleUrls: ['./mercadopago.component.css']
})
export class MercadopagoComponent implements OnInit {

  usuarioId: any;
  usuario!: Usuario;
  id!: string;
  texto: string = "soy un texto";
  pedido: Pedido = new Pedido();

  constructor(
    protected mercadopagoService: MercadopagoDatosService,
    protected usuarioService: UsuarioService,
    protected pedidoService: PedidoService,
    protected router: Router,
    protected route: ActivatedRoute) { }

  ngOnInit(): void {
    this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;

    
    this.usuarioService.ver(this.usuarioId).subscribe( usuario => {
      this.usuario = usuario;

      //obtengo el ultimo pedido del usuario(actual a pagar)
      //this.pedido = usuario.cliente.pedido[usuario.cliente.pedido.length -1];
      this.pedidoService.getPedidosByClienteId(this.usuario.cliente.id).subscribe( pedidos => {
       this.pedido = pedidos[pedidos.length -1];
      });
    });
    
  }

  hola(texto: string){
    //reducir stock de insumos
    alert(texto);
    console.log(texto);
  }

  metodoPagoContadoRetiroLocal(){
  
    //aplico el descuento a la factura
    this.pedido.factura.montoDescuento = (this.pedido.factura.totalVenta -(this.pedido.factura.totalVenta* 0.90));

    //10% de descuento en factura
    this.pedido.factura.totalVenta= (this.pedido.factura.totalVenta* 0.90);

    //10% de descuento en pedido
    this.pedido.total = this.pedido.factura.totalVenta;

    //10% de descuento al detalle articuloManufacturado pedido
    this.pedido.detallePedido.map(detallePedido => {
      if(detallePedido.articuloManofacturado){
        detallePedido.subTotal = (detallePedido.articuloManofacturado.precioVenta * 0.90);

      }
      if(detallePedido.articuloInsumo){
        detallePedido.subTotal = (detallePedido.articuloInsumo.precioVenta * 0.90);

      }
      
    });
    
    //10% de descuento al detalle factura insumo
    this.pedido.factura.detalleFactura.map(detalleFactura =>{
      if(detalleFactura.articuloManofacturado){
        detalleFactura.subTotal = (detalleFactura.articuloManofacturado.precioVenta * 0.90);

      }
      if(detalleFactura.articuloInsumo){
        detalleFactura.subTotal = (detalleFactura.articuloInsumo.precioVenta * 0.90);

      }
    });

    //asigno la forma de pago
    this.pedido.factura.formaPago = "Contado";

    //asigno el tipo de envio (mp o contado en el local)
    this.pedido.tipoEnvio = 1;

    //asigno el numero del pedido
    this.pedido.numero = this.pedido.id;
    this.pedido.factura.numero = this.pedido.factura.id;

    
    //persistir***********
    //actualizo el pedido
    this.pedidoService.editar(this.pedido).subscribe(pedido => {
      console.log("pedido actualizado!");

      //redirijo al componente resultado

      //enviar mail
      this.pedidoService.postEmail(pedido).subscribe(ped =>{
        console.log(ped);
      });

    });
    
   this.router.navigate(['/','exitoso', this.usuario.id,'pedido',this.pedido.id]);
  }

  mpCheckout(){
    //llamar a la api y que genere el preference id
    this.mercadopagoService.getMPDPreferenceId(this.usuarioId, this.pedido.id, this.pedido).subscribe(mp => {

      var mercadoP: MercadopagoDatos = new MercadopagoDatos();
      //asigno mp a mpDatos
      mercadoP = mp;

      //asigno el tipo de envio (mp o contado en el local)
      this.pedido.tipoEnvio = 2;

      //actualizo los datos del mp del pedido
      mercadoP.fechaCreacion = new Date();

      mercadoP.estado = "0";
      
      //asigno la forma de pago
      this.pedido.factura.formaPago = "Mercado Pago";
      

      //asigno el numero del pedido
      this.pedido.numero = this.pedido.id;
      this.pedido.factura.numero = this.pedido.factura.id;

      //persistir***********
      //primero persisto mp y luego se lo asigno al pedido, lo hago asi
      //porque por algun bug misterioso si lo hago de otra forma da error
      this.mercadopagoService.crear(mercadoP).subscribe( mm => {
        this.pedido.mercadopagoDatos = mm;
        this.pedidoService.editar(this.pedido).subscribe( p => {
          console.log(p,"pedido actualizado con exito");

          //ejecuto el check out de mp
          new abrirCheckout(p.mercadopagoDatos.preferenceId);
        });
      })
      
    });
  }

}
