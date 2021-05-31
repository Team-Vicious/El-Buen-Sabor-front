import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { asyncScheduler } from 'rxjs';
import { ArticuloInsumo } from 'src/app/models/ArticuloInsumo';
import { ArticuloManofacturado } from 'src/app/models/ArticuloManofacturado';
import { ArticuloManofacturadoDetalle } from 'src/app/models/ArticuloManofacturadoDetalle';
import { Cliente } from 'src/app/models/Cliente';
import { DetalleFactura } from 'src/app/models/DetalleFactura';
import { DetallePedido } from 'src/app/models/DetallePedido';
import { Factura } from 'src/app/models/Factura';
import { Pedido } from 'src/app/models/Pedido';
import { Usuario } from 'src/app/models/usuario';
import { ClienteService } from 'src/app/services/cliente.service';
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
    protected usuarioService: UsuarioService,
    protected detallePedidoService: DetallePedidoService,
    protected pedidoService: PedidoService,
    protected router: Router,
    protected route: ActivatedRoute) {}
    
    id:any;
    usuario!: Usuario;
    usuarioAdmin!: Usuario;
    //pedidos: Pedido[] = [];
    pedido: Pedido = new Pedido();
    validarLogin: boolean = false;

    @Input() usuarioId!:number;
    @Input() adminId!:number;
    @Input() articulosManofaturadosCarrito!:ArticuloManofacturado[];
    @Input() articuloInsumoCarrito!:ArticuloInsumo[];

    ngOnInit(): void {

      //si trae id del home que haga la consulta, esto para evitar errores en consola
      if (this.usuarioId) {
        
        this.usuarioService.ver(+this.usuarioId).subscribe( usuario =>{
          this.usuario = usuario;

          //valdiar boton
          this.validarLogin = true;
        
        });
      }

      //trae user admin si es que se lo pasan desde componente admin
      if (this.adminId) {
        
        this.usuarioService.ver(+this.adminId).subscribe( usuario =>{
          this.usuarioAdmin = usuario;

          //valdiar boton
          this.validarLogin = true;
        
        
        });
      }
        
    }

    /*
    traerPedidos(){
        this.pedidoService.getPedidosByClienteId(+this.clienteId).subscribe( pedidos=>{
          this.pedidos = pedidos as Pedido[];
        })
    }
    */

    eliminarArticuloManofacturadoDelCarro(id:number){
      
      var i: number = 0;
      this.articulosManofaturadosCarrito.map(articulo =>{
        if (articulo.id == id) {
          //splice elimina en posicion i pero solo 1 elemento
          this.articulosManofaturadosCarrito.splice(i,1)
        }
        i++;
      })
    }

    eliminarInsumoDelCarro(id:number){
      var i: number = 0;
      this.articuloInsumoCarrito.map(articulo =>{
        if (articulo.id == id) {
          this.articuloInsumoCarrito.splice(i,1)
        }
        i++;
      })
    }


    comprar(){

      
      var pedido: Pedido = new Pedido();
      

      //detalles para articulos manofacturados
      this.articulosManofaturadosCarrito.map(articulo =>{
        var countCantidad = 1;

        //creo un dealle por cada articulo para asignarle el articulo al detalle
        var detallepedido:DetallePedido = new DetallePedido();
        detallepedido.articuloManofacturado = articulo;

        //recorro los articulo para ver si se repiten y aumentar la cantidad
        this.articulosManofaturadosCarrito.forEach(articuloAux =>{
          if (articulo.id == articuloAux.id) {
            countCantidad++;
          }
        });

        //asigno cantidad
        detallepedido.cantidad = countCantidad;

        //total precio detalle
        detallepedido.subtotal= articulo.precioVenta;

        //asigno detalle al pedido
        pedido.detallePedido.push(detallepedido);

        //asignar ped al detalle

        
      });
        
      //asigno fecha
      pedido.fecha = new Date();

      //calcular tiempo estimado de preparado del pedido
      pedido.horaEstimadaFin = new Date();

      //asigno el domicilio
      pedido.domicilio = this.usuario.cliente.domicilio;

      //en el swalFire saco el total
      var totalPedido:number = 0;

      //alerta para confirmar
      Swal.fire({
        title: '<strong><u>|CONFIRMAR PEDIDO|</u></strong>',
        icon: 'info',
        html:
          `Su pedido contiene lo siguiente: 
          <br> ${pedido.detallePedido.map(detalle => {
                totalPedido += detalle.articuloManofacturado.precioVenta;
                return '<br>'+detalle.articuloManofacturado.denominacion + '  $'+ detalle.articuloManofacturado.precioVenta;
          })}
          <br> ==[TOTAL]==: $${totalPedido}`,
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
            //recorro detalle pedido(articulosManufacturados del pedido)
            pedido.detallePedido.map(detallePedido => {

              //creo detalle de la factura y se los asigno
              var detalleFactura: DetalleFactura = new DetalleFactura();
              detalleFactura = detallePedido;
              factura.detalleFactura.push(detalleFactura);

              //recorro el detale del articulo Manufacturado
              detallePedido.articuloManofacturado.articuloManofacturadoDetalle.map( detalleArticulo =>{

                //acumulo el precio de los insumos del detalle del manufacturado
                totalCosto += detalleArticulo.articuloInsumo.precioCompra;
              });
            });
          factura.totalCosto = totalCosto;

          //asigno la factura al pedido
          pedido.factura = factura;

          //asigno el estado del pedido
          pedido.estado = 0

          //pasar y actualizar cliente con su pedido
          //this.usuario.cliente.pedido.push(pedido);
          pedido.cliente = this.usuario.cliente;

          //console.log(this.usuario.cliente.pedido);
          
          /*
          //persistir pedido a traves del usuario
          this.usuarioService.editar(this.usuario).subscribe(usuario => {

            
            //esto por el tema del numero del pedido y el auto incremente, entonces numero = pedido.id
            usuario.cliente.pedido[usuario.cliente.pedido.length -1].numero =usuario.cliente.pedido[usuario.cliente.pedido.length -1].id;
            this.pedidoService.editar(usuario.cliente.pedido[usuario.cliente.pedido.length -1]).subscribe( ped =>{
              
            });
            

            console.log("pedido actualizado");
            Swal.fire('CONFIRMADO!', ' confirmado', 'success');
            this.router.navigate(['/mercadopago/', this.usuario.id,'pedido']);
            console.log(usuario);
          });
          */
          
          
          
          //persistir el pedido
          this.pedidoService.crear(pedido).subscribe(ped =>{

            Swal.fire('CONFIRMADO!', ' confirmado', 'success');
            this.router.navigate(['/mercadopago/', this.usuario.id,'pedido']);
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
 
  }