import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  constructor( protected service: ClienteService,
    protected router: Router,
    protected route: ActivatedRoute) { }
    
    id:any;
    cliente!: Cliente;

    @Input() clienteId!:number;

    ngOnInit(): void {
      
        this.service.ver(+this.clienteId).subscribe( cliente =>{
          this.cliente = cliente;
        
        });
      
    }


    
 
  }