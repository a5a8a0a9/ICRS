import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-registe',
  templateUrl: './registe.page.html',
  styleUrls: ['./registe.page.scss'],
})
export class RegistePage implements OnInit {

  input = {
    email: '',
    password: ''
  };

  constructor(private router:Router,
    private fireAuth:AngularFireAuth) { }

  ngOnInit() {
  }

  registe(data){
    //this.router.navigate(['/question',10]);
    this.fireAuth.auth.createUserWithEmailAndPassword(data.form.value.email,data.form.value.password).then(result=>{
    console.log(result);
    localStorage.setItem("displayName",data.form.value.displayName);
		this.router.navigate(['/question',result.user.uid]);
    });
  }
  

}
