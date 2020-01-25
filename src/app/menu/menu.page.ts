import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from "@angular/fire/firestore";
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  public appPages = [
    {
      title: 'Home',
      url: '/menu/pages/home',
      icon: 'home'
    },
    // {
    //   title: 'List',
    //   url: '/menu/pages/list',
    //   icon: 'list'
    // },
    {
      title: 'Setting',
      url: '/menu/pages/setting',
      icon: 'settings'
    },
    {
      title: 'Logout',
      url: '/login',
      icon: 'walk'
    }
  ];


  user = {
    displayname: '',
    email: ''
  };

  constructor(private fireAuth: AngularFireAuth,private angularFirestore:AngularFirestore) { }

  ngOnInit() {
    this.initUserData();
  }

  initUserData() {
    this.fireAuth.user.subscribe(result => {
      //console.log(result);
      this.user.displayname = result.displayName;
      this.user.email = result.email;

      // this.angularFirestore.collection('users').doc(result.uid).get().subscribe(x=>{
        
      // });

    });

    
  }

  menuOpen() {
    this.initUserData();
  }

}
