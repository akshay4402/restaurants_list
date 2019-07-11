import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListRestaurantsComponent } from './components/list-restaurants/list-restaurants.component';
import { CreateRestaurantComponent } from './components/create-restaurant/create-restaurant.component';
import { ResRouting } from './app.routes';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AppService } from './services/app.service.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgxPaginationModule} from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ListRestaurantsComponent,
    CreateRestaurantComponent,
    PageNotFoundComponent
  ],
  imports: [
    ToastrModule.forRoot({timeOut: 3000,
      preventDuplicates: true}),
    NgxPaginationModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ResRouting,
    RouterModule.forRoot([]),
    HttpClientModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
