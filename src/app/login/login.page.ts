import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  
  users_db;
  user;


  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private httpClient: HttpClient,
  ) { }

  ngOnInit() {

  }

  login(data) {
    //console.log(data);
    this.fireAuth.auth.signInWithEmailAndPassword(data.form.value.email, data.form.value.password).then(res => {
      console.log(res);
      this.user = this.fireAuth.auth.currentUser;
      console.log(this.user.displayName);
      if(!this.user.displayName){
        this.get_users(this.user.uid);
      }
      else{
        this.router.navigateByUrl('/menu/pages/home');
      }

      localStorage.setItem("userId", data.form.value.email); //儲存使用者資料到網頁
      
    },
      () => {
        alert('帳號密碼錯誤');
      });
  }

  get_users(uid) {
    var env = this;
    this.httpClient.get('https://icrs-app.herokuapp.com/firebase/users').subscribe(result => {
      this.users_db = result;
      var current_user = this.users_db.find(y => y.uid == uid);
      console.log(current_user);
      this.user.updateProfile({
        displayName: current_user.name
      }).then(function() {
        //alert('success');
        env.router.navigateByUrl('/menu/pages/home');
      }).catch(function(error) {
        alert(error);
      });
    });
  }
}
