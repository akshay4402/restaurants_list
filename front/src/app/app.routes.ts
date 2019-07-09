import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateRestaurantComponent } from './components/create-restaurant/create-restaurant.component';
import { ListRestaurantsComponent } from './components/list-restaurants/list-restaurants.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';


export const ResRoutes = [

    {
        path: '',
        component: DashboardComponent,
    },
    {
        path: 'list',
        component: ListRestaurantsComponent,
    },
    {
        path: 'create',
        component: CreateRestaurantComponent,
    },
    {
        path: '**',
        component: PageNotFoundComponent,
    },

];

export const ResRouting: ModuleWithProviders = RouterModule.forChild(ResRoutes);
