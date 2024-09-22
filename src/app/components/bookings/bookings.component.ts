import { Component, OnInit } from '@angular/core';
import { CoreModule } from '../../modules/core.modules';
import { PrimengLib } from '../../modules/primenglibs.module';
import { BookingInfos } from '../../models/rental';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CookieCustomService } from '../../services/cookie.service';
import { CustomMessageService } from '../../services/custom-message.service';
import { UserInfo } from '../../models/customer';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CoreModule, PrimengLib],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css'
})
export class BookingsComponent implements OnInit{
  bookings: Array<BookingInfos> = [];
  customer: UserInfo | null = null;
  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute, private messageService: CustomMessageService, private authService: AuthService){}
  
  async ngOnInit() {
    this.customer = this.authService.getUserInfo();
      if(this.customer){
        let bookings = await this.apiService.getBookings(this.customer?.id);
        this.bookings = bookings.sort((a, b) => b.rentalId - a.rentalId);
      }
  }
 
}
