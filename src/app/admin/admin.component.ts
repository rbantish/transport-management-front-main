import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../components/footer/footer.component';
import { CoreModule } from '../modules/core.modules';
import { PrimengLib } from '../modules/primenglibs.module';
import { HeaderAdminComponent } from './header/header.component';
import { NavbarComponent } from "./navbar/navbar.component";
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { CustomMessageService } from '../services/custom-message.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CoreModule, PrimengLib, HeaderAdminComponent, FooterComponent, RouterOutlet, NavbarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent  implements OnInit{
  driversCount: number = 0;
  vehiclesCount: number = 0;
  moneyThisMonth: number = 0;
  tripsAndRental: number = 0;
  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute, private messageService: CustomMessageService, private authService: AuthService){}
  
  async ngOnInit() {
    this.driversCount = await this.apiService.retrieveDriversCount();
    this.vehiclesCount = await this.apiService.retrieveVehiclesCount();
    this.moneyThisMonth = await this.apiService.retrieveMoneyThisMonth();
    this.tripsAndRental = await this.apiService.retrieveTripsAndRentalCount();
  }

}
