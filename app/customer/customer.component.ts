import { Component } from '@angular/core';
import { CoreModule } from '../modules/core.modules';
import { PrimengLib } from '../modules/primenglibs.module';
import { HeaderComponent } from "../components/header/header.component";
import { FooterComponent } from "../components/footer/footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CoreModule, PrimengLib, HeaderComponent, FooterComponent,RouterOutlet],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent {

}
