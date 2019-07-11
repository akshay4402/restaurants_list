import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-restaurants',
  templateUrl: './list-restaurants.component.html',
  styleUrls: ['./list-restaurants.component.scss']
})
export class ListRestaurantsComponent implements OnInit {
  totalRestaurants: any;
  totalRestaurantNumber: any;
  p: Number = 1;

  constructor(private appService: AppService, private router: Router) { }

  ngOnInit() {
    this.appService.getRestaurants().subscribe(val => {
      this.totalRestaurants = val;
      this.totalRestaurantNumber = this.totalRestaurants.length;
    });
  }

  getRestaurantTypes(val) {
    if (val === 'fast') {
      return 'Fast Casual';
    } else if (val === 'family') {
      return 'Family Style';
    } else if (val === 'fine') {
      return 'Fine Dining';
    } else if (val === 'cafe') {
      return 'Café or Bistro';
    } else if (val === 'truck') {
      return 'Food Truck';
    } else if ( val === 'buffet') {
      return 'Restaurant Buffet';
    } else if ('pop') {
      return 'Pop Up Restaurant';
    }
  }

  getStars(val) {
    if (val === '*') {
      return '★';
    } else if (val === '**') {
      return '★★';
    } else if (val === '***') {
      return '★★★';
    } else if (val === '****') {
      return '★★★★';
    } else if (val === '*****') {
      return '★★★★★';
    }
  }

  edit(id) {
    this.router.navigate([`/edit`, id]);
  }

  delete(id) {
    this.appService.deleteRestaurants({id: id}).subscribe(val => {
      // write notifications here
      console.log(val);
    });
    this.appService.getRestaurants().subscribe(val => {
      this.totalRestaurants = val;
      this.totalRestaurantNumber = this.totalRestaurants.length;
    });
  }

  add() {
    this.router.navigateByUrl('/create');
  }

  back() {
    this.router.navigateByUrl('');
  }

}
