import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../../services/app.service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-restaurant',
  templateUrl: './create-restaurant.component.html',
  styleUrls: ['./create-restaurant.component.scss']
})
export class CreateRestaurantComponent implements OnInit {

  public restaurantForm: FormGroup;
  id: String;
  actionType = 'Add';


  constructor(private _fb: FormBuilder, private toastr: ToastrService, private appService: AppService, private router: Router) { }

  ngOnInit() {
  // initaiate form values
  this.restaurantForm = this.initForm({});
  if (this.router.url.split('/')[1] === 'edit') {
    this.actionType = 'Edit';
    this.appService.editRestaurentVal({id: this.router.url.split('/')[2]}).subscribe(val => {
    this.id = this.router.url.split('/')[2];
    this.restaurantForm = this.initForm(val[0]);
    });
  } else {
  this.restaurantForm = this.initForm({});
  }
  }
  // initaiate form values
  initForm(val: any) {
    return this._fb.group({
      name: [val.name ? val.name : '' , Validators.required],
      address: this._fb.group({
        line1: [ val.address && val.address.line1 ? val.address.line1 : '', Validators.required],
        line2: [val.address && val.address.line2 ? val.address.line2 : '' , Validators.required],
        street: [val.address && val.address.street ? val.address.street : '' , Validators.required],
        postalCode: [val.address && val.address.postalCode ? val.address.postalCode : '' , Validators.required],
        city: [val.address && val.address.city ? val.address.city : '' , Validators.required],
        state: [val.address && val.address.state ? val.address.state : '', Validators.required],
        country: [val.address && val.address.country ? val.address.country : '', Validators.required],
        telephone: [val.address && val.address.telephone ? val.address.telephone : '', Validators.required],
        fax: [val.address && val.address.fax ? val.address.fax : ''],
        email: [val.address && val.address.email ? val.address.email : ''],
        website: [ val.address && val.address.website ? val.address.website : '']
      }),
      type: [val.type ? val.type : 'fast', Validators.required ],
      vegOrNon: [val.vegOrNon ? val.vegOrNon : ''],
      stars: [val.stars ? val.stars : '*'],
    });
  }

  onFormSubmit(pForm) {
    if (this.router.url.split('/')[1] === 'edit') {
      pForm.value['edit'] = true;
      pForm.value._id = this.id;
    }
    console.log(pForm.value);
    this.appService.saveRestaurant(pForm.value).subscribe(val => {
    // if (val + '' === 'success') {
    //   this.toastr.info(`Restaurant Created successfully`, 'Success!');
    // } else {
    //   this.toastr.error('Something went wrong', 'Error');
    // }
    });
    this.router.navigateByUrl('/list');
  }

}
