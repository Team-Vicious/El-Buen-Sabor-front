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
  @Input() articuloInsumoCarrito!: ArticuloInsumo[];
  @Input() articulosManofaturadosCarrito!: ArticuloManofacturado[];
  @Input() botonIngVisible!: boolean;

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
      imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYWFRgWFRYYGRgaGBgYGBgcGBgaHBgcGBgZGhgZGhocIS4lHB4rHxgYJjgmKy8xNTU1GiU7QDs0Py40NTEBDAwMEA8QHxISHzQrJSs0NDQ0NDo2MTQ2NDQ0NDQ0NjQ0MTQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP/AABEIAKgBLAMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAEBQMGAAIHAQj/xAA9EAACAQMCBAQEBQMDAwMFAAABAhEAAyEEMQUSQVEiYXGBBjKRsRNCocHwUtHhBxTxFWKSorLCIzNDcoL/xAAZAQADAQEBAAAAAAAAAAAAAAACAwQBAAX/xAAuEQADAAICAgECBQMEAwAAAAAAAQIDESExEkEEE1EiMmGBoQVx4RSRwfAjQrH/2gAMAwEAAhEDEQA/AKzaFHW1xQFt8imQ2rwrPZQK+DRmkfNCbmj9BbzS8mvHkOOx7pUxWutTFE6YYqHXHFQY+aHUyt6psxUVo5qTVrmobIzXpyvwktDJExWy2a3tbVMgrZYDB3SBS/UvFNb5xSbVmjnlmMWai9UKZra8BNZaWqekL7ZOmK356hZ68VqHQWwgvNaulRBqmUzXdGA/MQaY6JjQb71NprkV1coxFj0po/lxSvQEsQFBJ7CrjwvgDNBuYHYb0lRVPSDdKVtlWv25oE6J3MIpY+QmupW+A2FzySfPNG2tIifIqj0Ap8/HpdsS8y9I5fp/hG4w5nlR2Ak0fpPh7TJl1dz5ho+m1dEK1pyDtRVhr/1f8HTkXtfyVBdDZUSiKO2KHe0JlkUjtFW99DbJkil2o4ZnBEdJqHL8fMue/wCxXjzx0B6FLDCDbUGtdVw60TKjlHvn0rXXaVkIYDaBiptVp7l1VVRChQZmN+k0M3enNLlfobSnapPhiZ+CW3YqC4nAO4BpDxn4S1Fs4hx0IxPtXRNNpeRVDA4GSB/M0ytMlxe48xBqnFNuee/RPkuU+Ojhen4ddZmVbbsV+YBSSPWKjuoVJBBBG4Igj2rtj6LkbmtQGnIIww7GlfFuD2NXK3FNq9+VwN/fZh5GmrvVcP8AgDfG1yjkEV6wpzxzgV3TNyuvh/K4+Vv7HypWFrXwEuejRRW9atUfOa43oItnNHq+KWLvRtsSAKlpD0wzT2pzTHTWoNDaJKbadKhzU+UOkMtbVBqtqIWh9VtSMKaYdFd1vWhbBonWnND6cV6M/lJ2M7b4ohGoNTitxdo5Qps21L0k1T0Zqr9JdTqadEgVRo5r1GihfxprJqjxF+QXM1gFRIak56Fo3Zsorfniow9YTWaO2Sc807+HeBvqWwIQHLfsKF+G+DnU3QmyDLny7eprrui0yW0CIAqgdK5o7ZnCeD2rIARRPU9TTYeWKEQEZxUwMdM06GkuhVcm/PvvWAz6V5z9/wCeQrS7cAOfp/xRbM0es2fSvC/cyftUVy/7Ch1ux8wgdwMfX3oXWmEp2gm5e7/4obU3AQRvywSDuPLH6VA1nJ5WXYES/vke9A3kdWAcgzgLM5JjJwSvr+1Lq2lyMmVvhjDSBWjJ3PzCJ7CNyPOjLgMYx09BS0XeR1kyxEAScCcmPYUw1Hy8o+aMCkceLCr8yN7BCiM/efOpQ+Dn6Ult6O6iyS3WOU+ESZzHnNEDWssSpmmTl1KTTRlY9vhpjEXEkIxholZ6j3qUoO09tqBN4XIPKGUDJO4O4gHef2orRXQZBG2xIAn2G1NVqnp/sJaaWyB9Ot4PavICOgOZHr3rnnxV8FPZBuWJdBkpuy+ncfrXUzvmR28/KtwoO+1MWPa03+4Pnp7R8581ac9dQ+OPggOGv6ZYubsgGH8x2b71ydwZIiCDBB3BG4NKcNPQ1ZE0MQKJttmg+apbVypHPBX5D3RvTO3cpDYvQKITVVL9PdB+WkPVu1FqnxQ+nuzXuoJiieFI5XsSats1pYNa605rSy1MU8At8hVy5UYu4qK41R81PieBNdkWpuUo1G9NbiTQr6eqI0hdS2LkSpVok6c1gsUboxSRg1rz1P8AhVG1qgTQTlmpepbckgDckAe9aLaorRNyOrxPKQY9K6mtcHKTq3wzw1dPZUR42EsfOmvOd1qq6P4it3IXm5WP5TjPaacWdQF/NOJIHSoqyVvVLQ+ca1tDrS6g5VjncefeiFvkrt+v8n1qvLreYSRkExvt2miE1bbA4OIxie1FPypS1sCsD7GgdugE9+3eozcJPc7nGBQR1xXYLOZJnA7AfT9aHbVnrEzMwPPMR/Jov9RPpnThr7DIvncHPmPvNa/jAfmKj/8An6yaTjWEROevmfMnpW5vztzbySYIMHYRkH+TWrNvo14WuxjZ13KxKwwj5QFBJxBmdts/2oS8zMec2lQCSUjLMJ5W5ojtjzrexcDbLmDJGREZ5tu8dfeo7pIJKmI2+YCRPQ9Mfrt22m2u+AVKVdGcPt85Dtlt9jAIiaaveJZQrqoPpzN2A7fTahNPcQKYIWd/XqPL0868tllB5crklgJx+YCD4Yz0O4roeuAaW9sYM90kKyhcT4Sxn/tDMgHv+gmhlcgkMjAbiMdep3z9Kh0+sukqrEcqhCzAHmDCCQ0dCRt2NNkviICypJEgSAdoMbGSR7RT0lXOxTbnjQruEEFWUcpiYJBBGRmd5mp7HzqymV+WJBAkbduwmetRvys2YAJIkbRn67Dfb77aYqjAA/aCPQGP50pfgt7/AFD3wHXrzIOYAlPzLBLL3IicDt9KNtuCAQZBqEXARM+vl/J61oFKyQAe6jE5EsJ2O+OtUpuXvtCGk1r2HCq3xT4H0t+4bjJ4m3gxJ7x3qwo8iRBB6ipOancNCuUfORSvUTNMDp6waevI+oj13jIhgV4rmana1WLp6BWkb4bDtJcgUVcvYoOzaNSm2aF5EzVGgDUiTWWbFHppZNHpo8bUP1PSOc6ET2a0WzTfUWIodLdVw+BTSAhpq2/2lM0tVKbNGqM0hI+lqBtPTy5aoJ7dc6NUi78CtTYpgbdaMlYmFoXmzWfh0YyUWNLyJzGGDbAZIPatqvFCrqZW2Lb+l5ApJ3E0TotfcSORyR2OR6ZpbqXd3JUNAPKC0CDGRVh+FuHI4Z7jAKmSJGcTQ68uK0xOPO98j7hHEHuiHsnl/qQEj6H9qapcUbe4OCD5g1HwT4qssGRE5Qo8G0sO8dKQ8Sdrjs5WJMAUjPhxTKcvkpwVWSnvosVy5/O1DMhaYj3Bx7VW7TOniVmHocT6bUVpuOumHRXH/ifqMfpUaSfsueGl+XkaXrRU5z0Pb2r0NGZgDGYn+bZry1xOzc3PKT0fEehGK3v2ABlpPQ9AB/k71qbkB76pchNu8Cv9R3Jnt2BHh95+9S27p3PfIwPPHfcdjS6yCPUbT36fap+fAlc9IjlE/wDaR1p85uORNY+eBhZRCVJzBYg5iTjI84BrW5fYMwHhHXOQcQcHqCNhON6BTUHm5SYMTB2I8sRHlU95lGQAXMSxnpGB9K76vvozw5CzeKxzQSR1Ek9xIHuM5qWw45S6x1HJBJPQrHUyN+wgdZr7agScHJODkfUma1TUFR4Yn6gjsQd6dOfnkGsH2LVZ1SFcgwDhip6n19elSNZQHmA8OCIGPlJEYx0/xVc0uoXxEqc7suAJ6lQIOeojFMNNdKkADHhMrylWnbBE9TtTpzp9oTWFrpjW1cMggypJzO3r5b1It1uwPTuD69jIqFVkyPCTBxGZPT3+5rw2ySejDeDAMmcj+bGneT1wK8VsO01w8zKRykZxswP5vXv60WCaFtbBuoWD6Y/tRaLinY96EXrZzVuEg9K1PBhR9vVL3qUakV4c4aPReRin/pArZeFr2pi+pFQHWDvRrCzPqMj/ANgBUbaXyqY6wd69t6kE0FfHYays1saQk7UyGhgZqbSsKLuMIqnDhUrkReRtlW4npopctqn3EIJig1sU58PgOegNEonkqdbNbm1XbNFl9KAdabalKXMlC2GgcrWjLU5StSlEjGRafSs7hVEknb+9F8bU2HRCFYblVaPqelMvhzX27L+OAWICz1phxf4Sa8XuK6jnPNykdIzkVtx5JaW2RfIbb0UJeT8ZWRSigyZPOAfKo9Q/K7nlKqYgA4ZicSBTHScL1ElAkEyMjoOx71YbfwgCskZ/pnH1pW62ImW0VzguldGBAJPeMZ6Cr7Z0IdIYZNTabRKiBQm3lRa8wjlXHWscNvkrivBakVPwgBGDDbIPaKrum0YvJ+JZ8SyR0OQYO1XQs78yuhC7A8wPMD5dKW2CtmLduywUYAVDGes7de9LrDPpFWP5Nz7K8eF3I+Q/Sp9PwjwlmLIRAxMsCTJxvGMVbFtk/lNB8S0VxlItuLZ/rKq0Y7NjtQrCHXzG+CtXRqVwjBk6cw8UdA2Bn+9E6biNwCLlv1KsM98EfvTq3wy5ygO4YgQW5eXmPeBgelRvwkn8x+hrXi/QF51XegVLyP8AKTzAbHcTvH86VpcnY16/BQZ8RkecEGsfSOowXJ/7gW+hpVYn2jZypcMDKnfcfyKnUdR/PrtW/KwHitn1H3g1vbQMNmHqP7VyTXoY8kshtvAgkwcbDbr/ADzo6xdPIBJlZ5ZlY22I9BigXtFZkH1Ga0t6hhiJ8v3xRzWjHKrosfDtUTKkQ2878077dSRvTKczv09ANo/T6VWUvGQVmeo9OlOtPqxjqp67em3lVmPKmtEuTG09ocWW6FelE84pel0E94x+uJoi26xVc2iSoOdW9OT0ijbWkah7N7O9ONI4NdMyzqdIX3eFuepoHUcJYd6uAdYoDWXlrqiF2dN2VH/aEHJoqx4an1N1aBe+JqaqlcIdM0+x3p9aBW97XTtSJXNb85oUGpDw8miEFL7U0darGMCESpWt1loURy4rUA2JtXapa9mnupSgmt0tvkbPQra106wTv2qDhFi490K8Ks4J6+XrSXj92bsh5CnA6RHiFTX+I2S6XgzBwCPwxK7AhfENhsZ8tqrwzKW32JyVXOuiy/EOltInPyF2U+EAEw35ZjbOPei9Bx5yyo45UKBgxMQCNj59KpWqvJ+P+IXf8ZYkoSAYVhDQwPNIAInEmRjJWp4gWRhzsjMyw7ukIPzf/bQEpBzExjtNNuJb23piFTa62X/h/ELLsw+YrJzkEbEx1E1tZ+INOQSHAHNyiIP5oB8M4+3Wuai+rqA5VWLkEhzbVw3NDE8pICtzeGQIBAAPLLFdI62vxXHIzKfAxADoG3VFBcnlMDE+LMELQrFxw/4Met9F01nHLIKj8RSCSGIcDkHKSCcZyAI869t8YtMPDfU+hmuV/wDTvHyh1IZyZzIERJMemOkZ61vc4ehYkQSwAJwI8UFhIhTEEeU0isbb7/gYktdM6DorVhXL/iF3LEl3ILGTtzQPCJgAbCny8RRcc6k+RBrk1vg6FGYvyAYJdonxQRAEzAnb8p36gnSqzhEckywkO0eHqpIBMgQBFcsNLlP+Anp9nbf9wpzz/rion1ttd3E9c+XnXGr+iUCReYYkAuyxOczg7jFKL4LeHJ9WJHfqaJYaftf9/cBpI7mvHLLDw31EMVaSM8pIIEn9f+aFb4m0yjxXU5szDA/qY6VxUI5UKZ5R4vPb7etbLplG6/Xr5Vrxfr/By56R11/jfRqZ/EU425ge+w75rwf6g6PYuPofvFcnOmU7QBHpn6V4NJDQvKQfOem8jrQrD+r/AINf9kdUufHeiGzr9Hj/ANtQ3PjfScsh58lRyT/6Y+prmGp0Pt7dZirj8JfC1u6nPd8aTCrkLjck7n0peWMcT5U2bPlvWkML/wDqJpV/Jdb0RP8A5MKnHxnpTa/GAaOfk5YXnBiZ5Z+XzpL8ZfCSJba9ZEBcukkiP6lnIjqO1c7VIP70eHHiyx5TsC7uGdcHxbpiylWMHryECexkAzTPS/ENl9riAnvKn27VynSacMilw/LMkqATgEddhnejdIg8QKllX8wXpOOYDagrDC3oX/qqXZ2fR3gQGDBh3UgyO1HF2WOWCCJnbfyqnfCiKji1b5mLhGiMKGRmcluyke/OtX5NGY2/Wtxy/SbD+p5Lezka3G70Ta1jrsawaevfwKQ6f3L1MvtEjcTf+qh21jHdjXr2K8XTV22+2d4yukbJmirenmtbNqKPsit8dGNo0t6Sik0gqa2Kk54rU2CzRNMKISyK8R6kRqLQLZLbt0QUrWyKIdMUxIXTFWpTNLOJXFS27MYwY9TTq6map3xjzC4iHA5QY9etIpc7KcE+bUlJ1OqVdwJ9CR5dc+9BBiyGcSd/TcCi+M8P8Z5fEO/eQKBt23PLCkwcDoe9Ww5aTTJ8uK4py1x6PbLcoPVeoJ3IGCIOMk7dKbWLylQGVCskFgFBBAlfl8QBIgehwc0puaR1kwwHaD/Nql0lsy0bBTJ3MQI8JOYI+ho29rsVOk9aD7yjl5kefEPBBVh2iMDANbHiLMpVZZmCg5JUhNhAkMBAxkYpSLkjxEYn3kQPLESBH7VuuvPIFkEAeYMjYwOsdevtJzxaRvmmx1pkRNOzu3/1y4CIWPKqEAc2MKcEZkZGRmlb61+cHZsEQIAzgjoR/ao9AjO4A6mBv77Dp+/nUmpZBIOCCcftP+K1tN6ZqWlwHf8AUHZAGuF0gnlkwDIaGQ4JkYkEeVZYdX+RQrEwsljGDuTuTE9B5dKH0BR1/DJgkkTE5Pnt2oa4HR4yexIzEQDQ73tG9LY0vaoMrLzgmRzc0mTJHMPMY9hQt+ys8wIMhSMhRKkggLt06RvUT6G4AWZCB1MgHO2JmfIfahFLFwIb/wDUAkyOwGZxWyvsY2g9GBUBtxCg9I29o/WiLmkDKAo8RACxmfYEkSP+KWLqwPljrn7+h3rT8ed26jpMmQIED+RW+L2Z5ykFDSiFk5zzRsMAgwR26zTBUXkmIIMdeg37AUBbv8sMR1gEkQ0EgkY+WVrdNUH5jKxghYgcxIlcjYc2/kekSTnYKpI9vLg8xxJI2xtn+Yqx/BnGuV107N4XPgzsYJjAxMde9VbU6kH5iMKOXBz5E4jB3HbzmjfhO5bGtUsQQFPK0EAOY7++cUn5GNPE9r0bFfiSR1jU6YXEdG2dWRvRgQfvXIONfCz6fxEs9uSCwEFT5jYj0712M3kWJYZ8xJpDx7Uo9u5b5WYsjAQrRzEQMxGDXl/EyXjfHT7HPF9R60UHSm3/ALZgH5bqnw/MA6s0xHURPuKsXwqyvCIzfjXEI5GTcKCQyvsRAI74iq3Y4Ww8JHXEmIyN5xtzY86tXA7TI6nlUKgYcyyWKiCsf0rif5mvN4uWtt+/8Eb+HmdaUscfD5RLnOgcPyAy0siggYVtjIjzq52+MNHyz51W7JAxEDaNo8van2hMrPmaDHkpdMufxpxwk1sqp09Qtap41oULdtUFDJoVuleBKNexWh09ZL5CYOi0SiVGlszRiJinzafAFTo2tivStS21rcWSxhRNdK/FwC3wYi1Ki0w03CGI8WKZWOFovSfWqZw0++Ces0oUaceVMVtEjamC6dR0rcJTpwJdsRWbfQv0+gAlmz1rnXxPxEPfYtb5QIABBDEDYmdq6xS3jPB7eotlHUbeFoEqehBrM2F1Opev+R3xflTjybtb9b+xTNLw6zetK6oDI+3Sg3+GU3CR6YoThVi/p7joHBQMYEYaDEgdKdnizASyevLmPavJvNj3ren+hRmyap6e16FD8J5ehNJuI8BDEnkE9CMGrI3H7ZMGR6qR+tePxG2eozXTbT4YvyVejmus4G6E+Bo6eGftS+5pHBypXvKkbV1N3Ruv83pbqVQgww271VPyK9oBwn0c7GoeAikjOwJyTj+ep70WdK4UlkbzYgn7V0jgPC7EC4F53mOZlB5T1Cx996sGo0SOOQqMrnyMSRSL/qCVaS6GTj45ZxbSaVi3g5ldSvIIyT3E9eoo3h3Db2oYoHQFEZiz8wCqgkgkAwBHajvibR/hXRbxy55G8pB5T3AzHqaERuVLiiZcKpIZh4Q3MykAwwaF37VXObySr7hKZf4emV9WY9PP67/YfSveVm3BO5Pc+Zo5rRGSMVqUO3TtVE5FoCvi12mLypJnMd+uNv2o23bCgn6Tufaj9JpAAHdJSfm5TA6GTECPD/5irboeAaZ4lB59K55Ce8Lns52t4ycnM4HnUiqT5V0u/wDBemceEFSNiGP7zU+n/wBPtOw+d1PkQfuKH6m3pGwoX5jnWl0Sky5Jo4W1kAKB6kxV/T/Tm0Plv3Pon9q9uf6e/wBN/wCqf2NBU2y7DnwT+n7FN0t9l2Yj3I+1FpeJOSfeTTjXfCTWhLXEPkA01WtTfKNyhS7RMAHbvABNStPej0J+Tg15JjIAYOZziIj3p9pUHLGDGcHAJUZ226RtvSP4fttcUu6MIMKsNJ85IwM1dOF8DUgMS0HEYx5ERMe9T02q8Vywcv8AUMKWtv8A2ItLZMADB69snp7VZNInKoAyB1ra1wwDBWY/Sp/+mnocV3hm9SeTn+X9R8CRrdQG1RDmp7GgdukDzp/g7ekg/NSttgH4dR3BVgTg/wDU1TpwdBuJ9adPxL19gH8iUU/loqzZZtlJ9qtyaBBso+lEJbUbCjj4Tl7pg18tPpFe0PB2OXwO1PNPpVQYFT1hNVxjmekS1lquzateagr2tAMTmo7JZjviheafLxXLNWJ62xiWFeBh3ql/HHFTb5UViCZJjeB/mq/Y+KbiCCc9DQ18mZpyy7D/AEzJlxrIn36OrUl4lxrllUEnaTtRHCtct60GDAkrmOhjNVvV2CjENv8Aepfn/IvHCcdP2QrH405rtC3UAk8x9SepoYqeUkZ/ejCx2PSoWtAAgdR968LW+Qm2Vm5objMfFE1CbrJ4W75jtsTVkvAY7Dyz+1KeJcOLqSvzDIHeOlUY8ibSro6K8WCO6kd/Py71GNCHBhoPSevaDQ2n1E7+FgflMj2zRfzKTnGAM4HSe1UryngqTVIY/DWpazzIZKluZSJJU9fPp96sL8aRVIBWep6jyztVVLGB1BAJzmQIPp1rLrgKC53mR9iDU9Y1dum+RiekIPiriQvXgV2UETnxE7x9KCR+sn/irHqbCFQVAk9wPLr9aW6hMcqiO8bfSr8dz4qUuhNKttgqMeokdulE2+HB1lCA39JgA+h6H1paXKEc2AdvbEfUGm2kcET1n9O9HapdBRlaI7PD3AITm51Bd7TrhwsklNw8LkqYODE0w4Szl/AXVeXAJJ5c/KGI8QGf06zXl68IBJ9JP2ppw3iNq6IU8rA/LEA9AR/OtDeWvHhHZcrqdNE9zigtwGfPt36yaJ1HxTbtWTeRxcAYKyLhkJ2BB9D2mDS7VcGLgjl8WeUmDzECRntQPC9FbgpdB5LihHAkSOcMrqf6wYg+2xihx5Z1umyevDw/Ue8M+PlukhLN7AyeUFemCVY5zNWG1x2VBAJ9iM0g0tm3YBtoVgfLBQHB8jn3qb/cc55FKz0BcD/FLy58u/8AxrS/3EO1rWhrf1AvAhlIPk2RQWgtojMvLlvmIwx96F4VcZrhJhVQbkiC0xHn1PtTW1bHMQpDHEdYJ3B9+vnSHOW1umZ5PWiZdM1uVUBwcyCRjzFNNBfZbUElWZ4BIjYTHpUenvFV8TEEDEekRipWufiDxgjPh7iIz96djjx5T511/kwYabXSFLH8xX/M+9MPxB3pNa04UQfpRBQnNWYsuRL8S2cJC8EHtT7h+s5x8sVXn3NQa7id9Ei0g9SaLFfi39i648lou6tXtcz4X8X6i23LqELAn5lG3tVz4d8Q2bvyuJ7HB+hqucs17Jqw1I4r2o0vKdjUgNM2L0ZWRWVlaYD3NEpMkCaCbRuhJttM/lP7Gk/GvixbOo/DBwo8W0FjBjuIH3qw8N163V5lPtU6+nVNLtBzlpcdorfEfh83zz3WgxERt70vT4DUt428PkTJ8vKr7eWRQ3NSbxSq2+S6Pn51PjL0v/gNw3hluwvLbAUdT1J7k9a112lDjO9HBMSKHdq25Xj4tcErbdeTe2IrWksluS4XVpxOAfQ0WOD2UPNBPqSR9K21tsMDImgTxFVQJMkY70jEsctzUr+4bnfKFnFrSqTy7bx2pMGD7YPUU01dwsZg0n1lo/Mpg1HlwQ6bngasU0v1I9Rp0ZhzgyCIYb+84ND30VGICgzsYj+daz/ds3hfBH5th79qMTTc0kzPLMZ6A/2pDVTwxF46l6YDb08jm5iIPUzHUR+tQahCTvI2kCP8fpRzsBgT6fua1mcmP0rlTXJ01XSBnthuWFgARHeDXtzTg7Ht0z9Y7UQLyDrPoJrddYo/KT+grVV+kPlZK9C5uEF55R80g9AQfX0oW1wS4jKqyTJJiOQAdKeNqmYf0jsDkzuOb+0VljVQQNh5Y6U+clpaY2cL7oGTgaSC3M0mNsevYCiNHwNAJk828CBtt0qDUcdRLjqVY8vKFdWWC3KCQwbYdJoixxNQhckHOAuYPMAZY9pFdXmtb9gVnwzx/wADjTIRBaDykb5/X3oK1woc2zYbAOTA+Uz/AEwB6UwB8jBhllSvMpyDBGxnfyNGhh1gYGATmh8dg3hm9VL4F2m4ViXMtviDEnaetGpw5P6QDG9G2banJI7xIqXmU5Gw9c09JpArDC9bIV0KiPD22Mb9amt2guQkHvNEWxRVnSlvSmSqr8pziF2gVVLHC53kjB8poq3w64ckj0FMtPpwtEiq4wbX4mS0p3+EEtaP+oz5D+9Fi2O1e15NPWOV0gdFMRTUrnYVlZXm+j0fZE6CcgVqNEjT4QD3G9ZWVz7QXon0Oma2MOxzuTNM7WtYbma9rKd50uhHin2H6S+zE4wOv7CjKysq6ekSV2wTVcOR8sonvAn615a4ci5jPfb7V7WV3itmejZLDAQTJ8p9tzQ95H6LNZWUj5ELQcU0bqWgA4qN09aysoUto3YKbJdQYKyJgxI8jGJoVeEKpLHxMevasrK36EfYLyZBc0oPSgNVwzqM+RrKyp7hDJpi7VcHVlnl+lLV4Q0eB3X/ALeYwPSayspFSh0032BHh90HD8xG4M/tUVzSXh/+OY7GfvWVlbMpjd66Bylxc/huD5D+1ePfcbo57yrZisrKJQjfNmiXLnKSLTmOpDKB6kivG4nyDxGDsVBkknsYFZWVqhEubParhlf1LlrrN1LEkbnvBirDpNIrIvIx5AFe8MwjR8xaIjoB3NZWUeTr9jz77ZYbfE3fkVUZuRF5RPi5diY3ic56Vv8AiXiRy2XM94FZWUMY5rstw5q8EhhY0mraIsoPNn/sKb6XhWoJl3RfIAtH2rKyq1gj7G1lof6Hh3KPExY/T9BTJUArysp0ykuCd02+TGaK8VwaysrTPR601vNZWVoJ/9k=',
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',
    })
  }

}