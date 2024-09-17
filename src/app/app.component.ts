import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import { MessageService } from 'primeng/api';
import { PrimengLib } from './modules/primenglibs.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, PrimengLib],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'carRentalTripBooking';
  constructor(private messageService: MessageService, private router: Router){
    
  }
  
  ngOnInit(): void {
    console.log(this.router.url)
  }
  
}
