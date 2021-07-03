import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  infoTeam() {
    Swal.fire({
      title: 'Staff Proyect',
      html: `<p><h5>Luciano Grilli</h5>
      (Lider de Equipo - <br>Programador Back-End y Front-End).
      <br>
      <br><h5>Joaquin Roza</h5>
      (Programador Back-End y Front-End).
      <br>
      <br><h5>Mauro Candia</h5>
      (Programador Front-End y Diseño).
      <br>
      <br><h5>Sebastian Mauriz</h5>
      (Diseñador y Administrador de Base de Datos).
      <br>
      </p>`,
      imageUrl: 'https://pbs.twimg.com/profile_images/724415945406472192/Pg-JX3jE_400x400.jpg',
      imageWidth: 200,
      imageHeight: 200,
      imageAlt: 'Custom image',
    })
  }

}
