import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { AppService } from '../../services/app.service.service';

@Component({
  selector: 'app-create-restaurant',
  templateUrl: './create-restaurant.component.html',
  styleUrls: ['./create-restaurant.component.scss']
})
export class CreateRestaurantComponent implements OnInit {

  public restaurantForm: FormGroup;


  constructor(private _fb: FormBuilder, private appService: AppService) { }

  ngOnInit() {
  // initaiate form values
    this.restaurantForm = this.initForm({});
  }
  // initaiate form values
  initForm(val: any) {
    return this._fb.group({
      name: [val.name ? val.name : ''],
      address: this._fb.group({
        line1: [ val.address && val.address.line1 ? val.address.line1 : ''],
        line2: [val.address && val.address.line2 ? val.address.line2 : ''],
        street: [val.address && val.address.street ? val.address.street : ''],
        postalCode: [val.address && val.address.postalCode ? val.address.postalCode : ''],
        city: [val.address && val.address.city ? val.address.city : ''],
        state: [val.address && val.address.state ? val.address.state : ''],
        country: [val.address && val.address.country ? val.address.country : ''],
        telephone: [val.address && val.address.telephone ? val.address.telephone : ''],
        fax: [val.address && val.address.fax ? val.address.fax : ''],
        email: [val.address && val.address.email ? val.address.email : ''],
        website: [ val.address && val.address.website ? val.address.website : '']
      }),
      working_hours: [val.working_hours ? val.working_hours : []],
      working_days: [val.working_days ? val.working_days : []],
      type: [val.type ? val.type : ''],
      vegOrNon: [val.vegOrNon ? val.vegOrNon : ''],
      stars: [val.stars ? val.stars : ''],
      created_at: [ val.created_at ? val.created_at : ''],
      updated_at: [val.updated_at ? val.updated_at : '']
    });
  }

  onFormSubmit(pForm) {
    console.log(pForm.value);
    this.appService.saveRestaurant(pForm.value).subscribe(val => {
      console.log(val);
    });
  }

}
