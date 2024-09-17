import { Component, OnInit } from '@angular/core';
import { CoreModule } from '../../modules/core.modules';
import { PrimengLib } from '../../modules/primenglibs.module';
import { CookieCustomService } from '../../services/cookie.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CoreModule, PrimengLib],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderAdminComponent implements OnInit {
  loggedIn: boolean = false;
  constructor(private authService: AuthService){}
  ngOnInit(): void {
    this.authService.loggedIn$.subscribe(x => this.loggedIn = x)
  }
}
