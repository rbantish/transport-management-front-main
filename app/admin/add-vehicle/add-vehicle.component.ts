import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CoreModule } from '../../modules/core.modules';
import { PrimengLib } from '../../modules/primenglibs.module';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CookieCustomService } from '../../services/cookie.service';
import { CustomMessageService } from '../../services/custom-message.service';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [CoreModule,PrimengLib],
  templateUrl: './add-vehicle.component.html',
  styleUrl: './add-vehicle.component.css'
})
export class AddVehicleComponent implements OnInit {
  vehicleForm: FormGroup = new FormGroup({
    vehicleTypeId:  new FormControl('', [Validators.required]),
    tripPrice: new FormControl('', [Validators.required]),
    dailyPrice: new FormControl('', [Validators.required]),
    seats: new FormControl('', [Validators.required]),
    carNumber: new FormControl('', [Validators.required]),
    make: new FormControl('', [Validators.required]),
    model: new FormControl('', [Validators.required]),
    year: new FormControl('', [Validators.required]),
    currentLocation: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
  });
  imageFile: File | null = null; // Holds the image file
  vehicletTypes: Array<any> = [];
  constructor(private apiService: ApiService, private route: Router, private activatedRoute: ActivatedRoute, private messageService: CustomMessageService, private customCookieService: CookieCustomService){}
  async ngOnInit() {
    let vehicleTypes = await this.apiService.retrieveAllVehicleType();
    if(vehicleTypes){
      vehicleTypes.forEach(x => {
        this.vehicletTypes.push({name: x.type, id: x.id});
      })
    }
  }


  // Event to handle image file selection
  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }

  // Submit the vehicle form
  async onSubmit() {
    try {
      if (this.vehicleForm.valid && this.imageFile) {
        const vehicleData = this.vehicleForm.value;
        // Send vehicle data and image to service
        let response = await this.apiService.addVehicle(vehicleData, this.imageFile, "1");
        if(response.status == 201){
          this.messageService.showSuccess("Success")
          return;
        }else{
          this.messageService.showError("Error occured while adding vehicle");
          return;
        }
      }
    } catch (error) {
      this.messageService.showError("Error occured while adding vehicle");
      return;
    }
    
  }
}
