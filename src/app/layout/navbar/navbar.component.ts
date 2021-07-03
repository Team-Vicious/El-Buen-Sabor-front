import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { asyncScheduler } from 'rxjs';
import { ArticuloInsumo } from 'src/app/models/ArticuloInsumo';
import { ArticuloManofacturado } from 'src/app/models/ArticuloManofacturado';
import { ArticuloManofacturadoDetalle } from 'src/app/models/ArticuloManofacturadoDetalle';
import { Cliente } from 'src/app/models/Cliente';
import { Configuracion } from 'src/app/models/Configuracion';
import { DetalleFactura } from 'src/app/models/DetalleFactura';
import { DetallePedido } from 'src/app/models/DetallePedido';
import { Factura } from 'src/app/models/Factura';
import { Pedido } from 'src/app/models/Pedido';
import { Usuario } from 'src/app/models/Usuario';
import { ClienteService } from 'src/app/services/cliente.service';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { DetallePedidoService } from 'src/app/services/detallePedido.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    protected configService: ConfiguracionService,
    protected usuarioService: UsuarioService,
    protected detallePedidoService: DetallePedidoService,
    protected pedidoService: PedidoService,
    protected router: Router,
    protected route: ActivatedRoute) { }

  id: any;
  usuario!: Usuario;
  usuarioAdmin!: Usuario;
  //pedidos: Pedido[] = [];
  pedido: Pedido = new Pedido();
  validarLogin: boolean = false;
  configuracion!: Configuracion;

  @Input() usuarioId!: number;
  @Input() adminId!: number;
  @Input() articulosManofaturadosCarrito!: ArticuloManofacturado[];
  @Input() articuloInsumoCarrito!: ArticuloInsumo[];

  ngOnInit(): void {

    //si trae id del home que haga la consulta, esto para evitar errores en consola
    if (this.usuarioId) {

      this.usuarioService.ver(+this.usuarioId).subscribe(usuario => {
        this.usuario = usuario;

        //valdiar boton
        this.validarLogin = true;

      });
    }

    //trae user admin si es que se lo pasan desde componente admin
    if (this.adminId) {

      this.usuarioService.ver(+this.adminId).subscribe(usuario => {
        this.usuarioAdmin = usuario;

        //valdiar boton
        this.validarLogin = true;


      });
    }

    //trae el objeto de configuracion
    this.configService.ver(1).subscribe(config => {
      this.configuracion = config;
    });

  }


  eliminarArticuloManofacturadoDelCarro(id: number) {

    var i: number = 0;
    this.articulosManofaturadosCarrito.map(articulo => {
      if (articulo.id == id) {
        //splice elimina en posicion i pero solo 1 elemento
        this.articulosManofaturadosCarrito.splice(i, 1)
      }
      i++;
    })
  }

  eliminarInsumoDelCarro(id: number) {
    var i: number = 0;
    this.articuloInsumoCarrito.map(articulo => {
      if (articulo.id == id) {
        this.articuloInsumoCarrito.splice(i, 1)
      }
      i++;
    })
  }


  comprar() {


    var pedido: Pedido = new Pedido();


    //detalles para articulos manofacturados
    this.articulosManofaturadosCarrito.map(articulo => {
      //var countCantidad = 1;

      //creo un detalle por cada articulo para asignarle el articulo al detalle
      var detallepedido: DetallePedido = new DetallePedido();
      detallepedido.articuloManofacturado = articulo;

      detallepedido.cantidad = 1;

      //total precio detalle
      detallepedido.subTotal = articulo.precioVenta;

      //asigno detalle al pedido
      pedido.detallePedido.push(detallepedido);


    });

    //detalles para articulos Insumo
    this.articuloInsumoCarrito.map(articulo => {
      //var countCantidad = 1;

      //creo un detalle por cada articulo para asignarle el articulo al detalle
      var detallepedido: DetallePedido = new DetallePedido();
      detallepedido.articuloInsumo = articulo;

      detallepedido.cantidad = 1;

      //total precio detalle
      detallepedido.subTotal = articulo.precioVenta;

      //asigno detalle al pedido
      pedido.detallePedido.push(detallepedido);


    });

    //asigno fecha
    pedido.fecha = new Date();

    //calcular tiempo estimado de preparado del pedido
    pedido.horaEstimadaFin = new Date();

    //asigno el domicilio
    pedido.domicilio = this.usuario.cliente.domicilio;

    //en el swalFire saco el total
    var totalPedido: number = 0;

    var tiempoCocina: number = 0;

    //alerta para confirmar
    Swal.fire({
      title: '<strong><u>|CONFIRMAR PEDIDO|</u></strong>',
      icon: 'info',
      html:
        `<h3>Su pedido contiene lo siguiente:</h3> 
          <h5>
          <br> ${pedido.detallePedido.map(detalle => {
          if (detalle.articuloManofacturado) {
            tiempoCocina += detalle.articuloManofacturado.tiempoEstimadoCocina;
            totalPedido += detalle.articuloManofacturado.precioVenta;
            return '<br>' + detalle.articuloManofacturado.denominacion + '  $' + detalle.articuloManofacturado.precioVenta;
          }
          if (detalle.articuloInsumo) {

            totalPedido += detalle.articuloInsumo.precioVenta;
            return '<br>' + detalle.articuloInsumo.denominacion + '  $' + detalle.articuloInsumo.precioVenta;
          }
          return ""
        })}
          </h5>
          <br>
          <br>
          Tiempo de Cocina ${tiempoCocina = tiempoCocina / this.configuracion.cantidadCocineros} Minutos
          <br>
          Tiempo delivery 20 Minutos aprox
          <br>
          El pedido llegara a su destino en ${20 + tiempoCocina} Minutos
          <br>
          <br>
          <br><h1> ==[TOTAL]==: $${totalPedido}</h1>`,
      showDenyButton: true,
      confirmButtonText: `confirmar y pagar`,
      denyButtonText: `cancelar pedido`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        //total pedido
        pedido.total = totalPedido;

        //creo la factura
        var factura: Factura = new Factura();

        //asigno fecha creacion factura
        factura.fecha = new Date();

        //asigno total a la factura
        factura.totalVenta = pedido.total;

        //asigno total costo a la factura
        var totalCosto: number = 0;

        //recorro detalle pedido(articulosManufacturados o insumo)
        pedido.detallePedido.map(detallePedido => {

          //creo detalle de la factura y se los asigno para manufacturado o insumo
          var detalleFactura: DetalleFactura = new DetalleFactura();

          //si tiene articulo Manufacturado
          if (detallePedido.articuloManofacturado) {
            detalleFactura.articuloManofacturado = detallePedido.articuloManofacturado;
            detalleFactura.cantidad = detallePedido.cantidad;
            detalleFactura.subTotal = detallePedido.subTotal;
            factura.detalleFactura.push(detalleFactura);

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
            factura.detalleFactura.push(detalleFactura);

            //de paso acumulo al total el precioCosto de la bebida
            totalCosto += detallePedido.articuloInsumo.precioCompra;
          }


        });


        factura.totalCosto = totalCosto;

        //asigno la factura al pedido
        pedido.factura = factura;

        //asigno el estado del pedido
        pedido.estado = 0

        //pasar y actualizar cliente con su pedido
        //this.usuario.cliente.pedido.push(pedido);
        pedido.cliente = this.usuario.cliente;


        //persistir el pedido
        this.pedidoService.crear(pedido).subscribe(ped => {

          Swal.fire('CONFIRMADO!', ' confirmado', 'success');
          this.router.navigate(['/mercadopago/', this.usuario.id, 'pedido']);
        });


      } else if (result.isDenied) {
        Swal.fire('CANCELADO!', 'cancelado!', 'warning')
      }
    })




  }

  //pasar imagenes de bytes a img
  formatImage(img: any): any {
    return 'data:image/jpeg;base64,' + img;
  }

  acercaDe() {

    Swal.fire({
      title: 'Acerca de...',
      text: 'La incorporación de una aplicación web tiene beneficios económicos aun cuando la economía se mueve en forma normal. Esto le permita al cliente crear su pedido, ver el estado en el que se encuentra, ver el tiempo estimado y recibir una factura cuando el proceso finaliza mejora la experiencia de usuario. En el largo plazo, esto permite aumentar la cartera de clientes a medida que se busca la manera de mejorar el servicio con promociones o premios por la fidelidad del cliente. ',
      imageUrl: 'https://imagenes.elcomercio.com/files/article_main_simple/uploads/2019/06/13/5d02843ad35a8.jpeg',
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',
    })
  }

}