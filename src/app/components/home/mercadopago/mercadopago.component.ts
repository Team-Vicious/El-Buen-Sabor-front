import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import * as EventEmitter from 'events';
//import { mercadopago } from 'mercadopago';
//const mercadopago = require ('mercadopago');
//const mercadopago = require ('mercadopago');
//const mercadopago = require ('mercadopago');

@Component({
  selector: 'app-mercadopago',
  templateUrl: './mercadopago.component.html',
  styleUrls: ['./mercadopago.component.css']
})
export class MercadopagoComponent implements OnInit {

  //pid:string = "";

  constructor(
    protected router: Router,
    protected route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    //this.pid = this.route.snapshot.paramMap.get('pid')!;

    //this.abrirmp();
  }

  abrirmp(){
    
    // Agrega credenciales de SDK
    // SDK de Mercado Pago
    
    // Agrega credenciales
    
    /*
    const mp = new mercadopago('PUBLIC_KEY', {
      locale: 'es-AR'
    });

    // Inicializa el checkout
    mp.checkout({
      preference: {
          id: this.pid
      },
      render: {
            container: '.cho-container', // Indica dónde se mostrará el botón de pago
            label: 'Pagar', // Cambia el texto del botón de pago (opcional)
      }
    });
    */

    /*
    let preference = {
      back_urls: {
        success: "https://localhost/MercadoPago/success.html",
        failure: "https://localhost/MercadoPago/failure.html",
        pending: "https://localhost/MercadoPago/pending.html"
      },
      auto_return: "approved",
      external_reference: "1800",
      items: [
        {
          title:'empanadas',
          description: 'empanadas',
          unit_price: parseFloat('500'),
          quantity: 1,
        }
      ]
    };
    
    mercadopago.preferences.create(preference)
    .then(function(response){
      console.log(response.body);
      res.redirect(response.body.init_point);
     
    }).catch(function(error){
      console.log(error);
    });
    */
  }
}
