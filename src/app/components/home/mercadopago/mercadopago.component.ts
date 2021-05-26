import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

declare var abrirCheckout: any;

@Component({
  selector: 'app-mercadopago',
  templateUrl: './mercadopago.component.html',
  styleUrls: ['./mercadopago.component.css']
})
export class MercadopagoComponent implements OnInit {

  usuarioId: any;
  id!: string;
  texto: string = "soy un texto";

  constructor(protected router: Router,
    protected route: ActivatedRoute) { }

  ngOnInit(): void {
    this.usuarioId = +this.route.snapshot.paramMap.get('idu')!;
    this.id = "736455939-7b77546b-fc99-47bf-98cf-b801e91f5d9a";
  }

  hola(texto: string){
    alert(texto);
    console.log(texto);
  }

  f(){
    new abrirCheckout(this.id);
  }

}
