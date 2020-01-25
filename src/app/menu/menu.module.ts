import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: ''
  },
  {
    path:'pages',
    component: MenuPage,
    children:[
        {
          path: 'home',
          loadChildren: '../home/home.module#HomePageModule'
        },
        {
          path: 'list',
          loadChildren: '../list/list.module#ListPageModule'
        },
        {
          path: 'setting',
          loadChildren: '../setting/setting.module#SettingPageModule'
        }
    ]
  }
  // { 
  //   path: 'home',
  //    loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
  // },
  // {
  //   path: 'list',
  //   loadChildren: () => import('../list/list.module').then(m => m.ListPageModule)
  // },
  
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
