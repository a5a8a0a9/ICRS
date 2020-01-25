import { Component, OnInit } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import * as _ from 'lodash'; 

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  
  stores;
  ranks;

  constructor(private httpClient:HttpClient) {
    this.httpClient.get('https://icrs-app.herokuapp.com/firebase/ranks').subscribe(x=>{
      this.ranks = _.orderBy(x, ['rank'],['desc']);
      //console.log(this.ranks);
    });
    this.httpClient.get('https://icrs-app.herokuapp.com/firebase/stores').subscribe(x=>{
      this.stores = x;
      //console.log(this.stores);
    });
  }

  ngOnInit() {
    
  }

  

}
