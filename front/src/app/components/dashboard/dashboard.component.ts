import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private appService: AppService, private router: Router) { }

  ngOnInit() {
  }

  create() {
    this.router.navigateByUrl('/create');
  }

  list() {
    this.router.navigateByUrl('/list');

  }

}
