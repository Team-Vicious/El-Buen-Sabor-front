import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import * as EventEmitter from 'events';
//import { mercadopago } from 'mercadopago';
//const mercadopago = require ('mercadopago');
//const mercadopagos = require ('./node_modules/mercadopago/index.js');
//import * as mercadopago from 'mercadopago'

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

    this.abrirmp();
  }

  abrirmp(){
    
    // Agrega credenciales de SDK
    // SDK de Mercado Pago
    
    // Agrega credenciales
    
    
    /*

    // Inicializa el checkout
    mercadopago.checkout({
      preference: {
          id: '736455939-ff08c43d-ed42-4c89-9e47-5e01d1ee894b'
      },
      render: {
            container: '.cho-container', // Indica dónde se mostrará el botón de pago
            label: 'Pagar', // Cambia el texto del botón de pago (opcional)
      }
    });
    */
    

    /*
    var preference = {
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
    */
    
    /*
    mercadopago.configure({
      access_token: 'APP_USR-26941b07-f466-4ecd-9d0a-d16fefa22623'
    });
    let preference = {
      items: [
        {
          title: 'Mi producto',
          unit_price: 100,
          quantity: 1,
        }
      ]
    };
    
    var idmp;
    mercadopago.preferences.create(preference)
    .then(function(response){
    // Este valor reemplazará el string "<%= global.id %>" en tu HTML
      idmp = response.body.id;
    }).catch(function(error){
      console.log(error);
    });
    */
    
  }
}
