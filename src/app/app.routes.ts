import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './services/auth.guard';
import { RentvehicleComponent } from './components/rentvehicle/rentvehicle.component';
import { TripbookingComponent } from './components/tripbooking/tripbooking.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { ContactComponent } from './components/contact/contact.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CustomerComponent } from './customer/customer.component';
import { AdminComponent } from './admin/admin.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { VehicleTableComponent } from './admin/vehicle-table/vehicle-table.component';
import { RentaltripTableComponent } from './admin/rental-table/rental-table.component';
import { DriverTableComponent } from './admin/driver-table/driver-table.component';
import { AddVehicleComponent } from './admin/add-vehicle/add-vehicle.component';
import { CustomerTableComponent } from './admin/customer-table/customer-table.component';
import { DriverRegisterComponent } from './driver/register/register.component';
import { DriverLoginComponent } from './driver/login/login.component';
import { DriverComponent } from './driver/driver.component';
import { NotAuthorizedComponent } from './components/notauthorise';

// Customer Section Routes
const customerRoutes: Routes = [
    {
        path: "",
        component: HomepageComponent
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "register",
        component: RegisterComponent
    },
    {
        path: "rent/:id",
        component: RentvehicleComponent,
        canActivate: [authGuard],
        data: { expectedRole: 'customer' }
    },
    {
        path: "trip",
        component: TripbookingComponent,
        canActivate: [authGuard],
        data: { expectedRole: 'customer' }
    },
    {
        path: "vehicles",
        component: VehiclesComponent,
    },
    {
        path: "contact",
        component: ContactComponent,
    },
    {
        path: "profile",
        component: ProfileComponent,
        canActivate: [authGuard],
        data: { expectedRole: 'customer' }
    },
    {
        path: "cart",
        component: BookingsComponent,
        canActivate: [authGuard],
        data: { expectedRole: 'customer' }
    },
    {
        path: "trip/:id",
        component: TripbookingComponent,
        canActivate: [authGuard],
        data: { expectedRole: 'customer' }
    }
];

// Admin Section Routes
const adminRoutes: Routes = [
    {
        path: "vehicles",
        component: VehicleTableComponent
    },
    {
        path: "add-vehicle",
        component: AddVehicleComponent
    },
    {
        path: "trips-rentals",
        component: RentaltripTableComponent
    },
    {
        path: "",
        component: CustomerTableComponent
    },
    {
        path: "drivers",
        component: DriverTableComponent
    }

];

// Full Routes
export const routes: Routes = [
    {
        path: "admin",
        component: AdminComponent,
        canActivate: [authGuard],
        children: adminRoutes,

        data: { expectedRole: 'admin' }
    },
    {
        path: "admin/login",
        component: AdminLoginComponent,
    },
    {
        path: "admin/profile",
        component: ProfileComponent,
        canActivate: [authGuard],
        data: { expectedRole: 'admin' }
    },
    {
        path: "driver/register",
        component: DriverRegisterComponent
    },
    {
        path: "driver/login",
        component: DriverLoginComponent
    },
    {
        path: "driver/profile",
        component: ProfileComponent,
        canActivate: [authGuard],
        data: { expectedRole: 'driver' }
    },
    {
        path: "driver",
        component: DriverComponent,
        canActivate: [authGuard],
        data: { expectedRole: 'driver' }
    },
    {
        path: "",
        component: CustomerComponent,
        children: customerRoutes
    },
    // Add a not-authorized route to handle access denials
  {
    path: 'not-authorized',
    component: NotAuthorizedComponent
  },
    {
        path: "**", // Wildcard route for handling 404 - Page Not Found
        redirectTo: "", // Redirect to homepage or a custom 404 component
    },
   
];
