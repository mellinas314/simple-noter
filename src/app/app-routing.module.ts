import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { NonAuthGuard } from 'src/guards/non-auth/non-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: '../pages/login/login.module#LoginPageModule',
    canActivate: [NonAuthGuard]
  },
  {
    path: 'home',
    loadChildren: '../pages/home/home.module#HomePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'clients',
    loadChildren: '../pages/list/list.module#ListPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'task',
    loadChildren: '../pages/task/task.module#TaskPageModule'
  },
  {
    path: 'task/:id',
    loadChildren: '../pages/task/task.module#TaskPageModule'
  },
  {
    path: 'client',
    loadChildren: '../pages/client/client.module#ClientPageModule'
  },
  {
    path: 'client/:id',
    loadChildren: '../pages/client/client.module#ClientPageModule'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
