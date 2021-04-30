import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { asyncScheduler } from 'rxjs';
import { ArticuloInsumo } from 'src/app/models/ArticuloInsumo';
import { ArticuloManofacturado } from 'src/app/models/ArticuloManofacturado';
import { Cliente } from 'src/app/models/Cliente';
import { DetallePedido } from 'src/app/models/DetallePedido';
import { Pedido } from 'src/app/models/Pedido';
import { ClienteService } from 'src/app/services/cliente.service';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  constructor( 
    protected clienteService: ClienteService,
    protected pedidoService: PedidoService,
    protected router: Router,
    protected route: ActivatedRoute) { }
    
    id:any;
    cliente!: Cliente;
    //pedidos: Pedido[] = [];
    pedido: Pedido = new Pedido();

    @Input() clienteId!:number;
    @Input() articulosManofaturadosCarrito!:ArticuloManofacturado[];
    @Input() articuloInsumoCarrito!:ArticuloInsumo[];

    ngOnInit(): void {

      //si trae id del home que haga la consulta, esto para evitar errores en consola
      if (this.clienteId) {
        
        this.clienteService.ver(+this.clienteId).subscribe( cliente =>{
          this.cliente = cliente;
        
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
      });

      //pasar y actualizar cliente con su pedido
      this.cliente.pedido.push(pedido);
    }
    
 
  }