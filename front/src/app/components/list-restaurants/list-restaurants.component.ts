import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service.service';

@Component({
  selector: 'app-list-restaurants',
  templateUrl: './list-restaurants.component.html',
  styleUrls: ['./list-restaurants.component.scss']
})
export class ListRestaurantsComponent implements OnInit {

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.getRestaurants().subscribe(val => {
      console.log(val);
    });
  }

}
