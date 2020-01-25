import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: 'app-question',
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss'],
})
export class QuestionPage implements OnInit {
	
	order = 1;
	user_data = {
		uid: '',
		breakfast: [],
		lunch_dinner: [],
		name: ''
	}

	breakfast = [
		{
			content: "漢堡類",
			checked: false
		},
		{
			content: "蛋餅類",
			checked: false
		},
		{
			content: "吐司類",
			checked: false
		},
		{
			content: "麵類",
			checked: false
		},
		{
			content: "米飯類",
			checked: false
		},
		{
			content: "鬆餅",
			checked: false
		},
		{
			content: "炸物",
			checked: false
		},
		{
			content: "燒餅",
			checked: false
		}


	];
	lunch = [
		{
			content: "速食類",
			checked: false
		},
		{
			content: "小吃類",
			checked: false
		},
		{
			content: "自助餐",
			checked: false
		},
		{
			content: "火鍋",
			checked: false
		},
		{
			content: "飯類",
			checked: false
		},
		{
			content: "麵類",
			checked: false
		},
		{
			content: "日式料理",
			checked: false
		},
		{
			content: "韓式料理",
			checked: false
		},
		{
			content: "港式料理",
			checked: false
		},
		{
			content: "義式料理",
			checked: false
		},
		{
			content: "牛排",
			checked: false
		}
	];

  constructor(
	  private router:Router,
	  private activatedRoute:ActivatedRoute,
	  private angularFirestore:AngularFirestore) 
	{
		this.activatedRoute.params.subscribe(result=>{
			this.user_data.uid = result.uid;
		});

		this.user_data.name = localStorage.getItem("displayName");
	}

  ngOnInit() {
  }

  pre(){
	if (this.order == 1) return;
	else this.order--;
  }

  next(){
	if (this.order == 2) return;
	else this.order++;
  }

  finish(){
	this.user_data.breakfast = this.breakfast.filter(x=>x.checked==true).map(y=>y.content);
	this.user_data.lunch_dinner = this.lunch.filter(x=>x.checked==true).map(y=>y.content);
	console.log(this.user_data);

	this.angularFirestore.collection('users').doc(this.user_data.uid).set(this.user_data);
	this.router.navigate(['/login']);
  }

}
