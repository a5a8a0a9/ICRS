import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  user;
  displayName = "";
  
  constructor(private fireAuth:AngularFireAuth) { }

  ngOnInit() {
    this.user = this.fireAuth.auth.currentUser;
    this.displayName = this.user.displayName;
    console.log(this.user);
  }

  update(){
    this.user.updateProfile({
      displayName: this.displayName
    }).then(function() {
      alert('success');
    }).catch(function(error) {
      alert(error);
    });
  }

}
