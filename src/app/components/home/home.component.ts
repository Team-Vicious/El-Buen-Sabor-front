import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloInsumo } from 'src/app/models/ArticuloInsumo';
import { ArticuloInsumoService } from 'src/app/services/articuloInsumo.service';
import { ArticuloManofacturado } from 'src/app/models/ArticuloManofacturado';
import { ArticuloManofacturadoService } from 'src/app/services/articuloManofacturado.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    protected articuloManofacturadoServices: ArticuloManofacturadoService,
    protected articuloInsumoService: ArticuloInsumoService,
    protected router: Router,
    protected route: ActivatedRoute) { }

  //validar horario
  fechaActual = new Date();
  abierto!:boolean;
  labelHorario!: string;

  articulosManofaturados: ArticuloManofacturado[] = [];
  articulosManofaturadosCarrito: ArticuloManofacturado[] = [];
  articulosInsumoGeneral: ArticuloInsumo[] = [];
  articulosInsumoNoEsInsumo: ArticuloInsumo[] = [];
  articuloInsumoCarrito: ArticuloInsumo[] = [];
  usuarioId!: number;

  filterPost!: '';

  ngOnInit(): void {
    this.traerArticulos();
    //traer id del cliente para pasar al navbar
    this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;

    if(this.fechaActual.getHours() >= 0 && this.fechaActual.getHours() < 25){
      this.abierto = true;
      this.labelHorario = "El local esta Abierto!",this.fechaActual.getTime();
      console.log("El local esta Abierto!",this.fechaActual.getHours());
      
    }else{
      this.abierto = false;
      this.labelHorario = "El local esta Cerrado!",this.fechaActual.getTime();
      console.log("El local esta Cerrado!",this.fechaActual.getHours());
    }

  }


  private traerArticulos() {
    //obtener art manofacturados
    this.articuloManofacturadoServices.listar()
      .subscribe(p => {
        this.articulosManofaturados = p as ArticuloManofacturado[];
      });

    //obtener art insumos
    this.articuloInsumoService.listar().subscribe(p => {

      this.articulosInsumoGeneral = p as ArticuloInsumo[];

      //filtro los que no son insumo
      this.articulosInsumoGeneral.map(art => {
        if (art.esInsumo == false) {
          this.articulosInsumoNoEsInsumo.push(art);
        }
      });
    });

  }

  verificarStockArtManuf(articulo:ArticuloManofacturado){

    var validador:Boolean = true;
    articulo.articuloManofacturadoDetalle.map( articuloDetalle => {
      if(articuloDetalle.articuloInsumo.stockActual == 0){

        validador = false;
      }
    });
    return validador;
    
  }

  verificarStockArtInsumo(articulo:ArticuloInsumo){

    var validador:Boolean = true;
    
    if(articulo.stockActual == 0){

      validador = false;
    }
    return validador;
    
    
  }



  almacenarArticulosManofacturadosSeleccionados(idArtuculo: number) {

    if (this.route.snapshot.paramMap.get('idu')===null){
      Swal.fire('Acción necesaria!',`Para agregar al carrito este producto es necesario loguearse`,'warning');   
    }
    else{
    this.articulosManofaturados.map(articulo => {
      if (articulo.id == idArtuculo) {
        this.articulosManofaturadosCarrito.push(articulo);
      }
    })
    }
  }

  almacenarArticulosInsumoSeleccionados(idArtuculo: number) {

    this.articulosInsumoNoEsInsumo.map(articulo => {
      if (articulo.id == idArtuculo) {
        this.articuloInsumoCarrito.push(articulo);
      }
    })
  }

  //pasar imagenes de bytes a img
  formatImage(img: any): any {
    return 'data:image/jpeg;base64,' + img;
  }

  verDetalle(articuloMf:ArticuloManofacturado){

    Swal.fire({
      icon: 'info',
      title: `Detalles de ${articuloMf.denominacion}`,
      html: `
      <br>
      <h5>
      ${articuloMf.articuloManofacturadoDetalle.map( detalles => {
        if(detalles.fechaBaja == null){

          return `<br><br>${detalles.articuloInsumo.denominacion}
          <br>cantidad: ${detalles.cantidad}
          <br>medida: ${detalles.unidadMedida}`
        }else{
          return "";
        }
      })}
      </h5>
      <br>
      
      `
    })

  }

  infoBar(numero:number){

    if(numero == 1){
      Swal.fire({
        icon: 'info',
        title: ` Ubicación `,
        html: `
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-house-door"
            viewBox="0 0 16 16">
            <path
              d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z" />
          </svg>
          <h5>Luzuriaga 385</h5>
            <br>
            <br>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3349.9185237874876!2d-68.85901838481483!3d-32.90032238093499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e090a270a64cb%3A0xf1533838bb9322ae!2sLuzuriaga%20385%2C%20Mendoza!5e0!3m2!1ses-419!2sar!4v1621386248566!5m2!1ses-419!2sar"
            width="350" height="150" style="border:10px;" allowfullscreen="" loading="lazy">Ubicacion</iframe>
          
  
           
        </div>
        `
      });
    }
    if(numero == 2){
      Swal.fire({
        icon: 'info',
        title: `Horario de Atención `,
        html: `
        <br>
        <h5>
        Lunes a Viernes 
        <br>11:00 a 15:00 -
        <br> 20:00 a 23:30,
        <br> 
        <br> 
        <br> sábados y domingos 
        <br>de 11:00 a 15:00
        </h5>
        <br>
        
        `
      });
    }
    if(numero == 3){
      Swal.fire({
        icon: 'info',
        title: `Contacto`,
        html: `
        <br>
        <h5>
        Email: elbuensabormdz@hotmail.com
        <br>
        <br>
        Teléfono: 261-4275726
        <br>
        <br>
        Tambien nos puedes seguir en Facebook!
        </h5>
        <a href="https://www.facebook.com/buen.sabor.7771/">
          Facebook
        </a>
        <br>
        
        `
      });
    }
    if(numero == 4){
      Swal.fire({
        icon: 'info',
        title: `Información para el usuario`,
        html: `
        <br>
        <h5>
        Para hacer un pedido tienes que 
        <br>registrarte o loguearte!
        <br>Una vez que tengamos todos tus datos,
        ya podras hacer pedidos!
        <br>En nuestro sistema podras hacer pedidos,
        elegir el metodo de pago que prefieras,
        tambien podras descargar tu factura en pdf, ademas 
        de que se enviara la factura a tu mail!
        <br> y mucho mas!
        </h5>
        <br>
        
        `
      });
    }
    if(numero == 5){
      Swal.fire({
        icon: 'info',
        title: `Info del Local`,
        html: `
        <br>
        <h5>
        El Buen Sabor es un local de comida rapida que hace entregas
        por devivery solo pagando por Mercado Pago o tambien podes
        retirar por el local y te hacemos 10% de descuento!
        <br>
        cualquier duda escribenos a nuestro mail! 
        <br>
        elbuensabormdz@hotmail.com
        </h5>
        <br>
        
        `
      });
    }
    

  }
}
