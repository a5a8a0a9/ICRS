import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient';
import { observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { AngularFireAuth } from '@angular/fire/auth';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFirestore } from "@angular/fire/firestore";

export class Message {
  constructor(public content: string, public sentBy: string) { }
}


@Injectable({
  providedIn: 'root'
})
export class HomeService {

  readonly token = environment.dialogflow.icrsbot;
  readonly client = new ApiAiClient({ accessToken: this.token });

  conversation = new BehaviorSubject<Message[]>([]);

  ranks_db;
  stores_db;
  users_db;
  most_similar_user;
  most_similar_ranked = [];
  most_similar_ranked_stores = [];
  min_length_store;
  sel_index = 0;
  user = {
    displayname: '',
    email: '',
    uid: '',
    pre_breakfast: [],
    pre_lunch: [],
    long: 0,
    lati: 0
  };

  constructor(
    private httpClient: HttpClient,
    private fireAuth: AngularFireAuth,
    private geolocation: Geolocation,
    private angularFirestore:AngularFirestore) {
    this.conversation = new BehaviorSubject<Message[]>([]);

    //this.initUserData();

    this.geolocation.getCurrentPosition().then((resp) => {
      this.user.long = resp.coords.longitude;
      this.user.lati = resp.coords.latitude;
      //console.log(resp.coords.latitude, resp.coords.longitude)
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  update(msg: Message) {
    this.conversation.next([msg]);
  }

  initGreeting() {

    var botMessage = new Message(this.user.displayname + '你好，歡迎使用icrs', 'bot');
    this.update(botMessage);
  }

  converse(msg: string) {
    var env = this;
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    return this.client.textRequest(msg)
      .then(res => {
        
        const speech = res.result.fulfillment.speech;
        var code = speech.substr(0, 4);
        //console.log(code);
        var bot_ans = speech;
        switch (code) {

          case "1001":
          case "1002":
            {
              var min = 99999;
              //console.log(env.most_similar_ranked_stores);
              env.most_similar_ranked_stores.forEach(x => {
                var temp_min = env.caclLength(env.user.long, env.user.lati, x.long, x.lati);
                x["length"] = temp_min;
                if (temp_min < min) {
                  min = temp_min;
                  env.min_length_store = x;
                }
              });
              //console.log(env.min_length_store);
              bot_ans = env.user.displayname + '你好，推薦您吃' + env.min_length_store.name;
              //console.log(env.most_similar_ranked_stores);
              var botMessage = new Message(bot_ans, 'bot');
              this.update(botMessage);
              break;
            }


          case "3001": {
            if (env.min_length_store) {
              bot_ans = env.min_length_store.name +
                '<br />地址：' + env.min_length_store.add +
                '<br />電話：' + env.min_length_store.phone;
              var botMessage = new Message(bot_ans, 'bot');
              this.update(botMessage);
            }
            else {
              var botMessage = new Message('請先找到餐廳', 'bot');
              this.update(botMessage);
            }

            break;
          }


          // case "1002": {

          //   var botMessage = new Message(bot_ans, 'bot');
          //   this.update(botMessage);
          //   break;
          // }

          case "1003": {
            env.sel_index = env.sel_index + 1;
            if (env.sel_index >= env.most_similar_ranked_stores.length) {
              bot_ans = "那麼多家都不喜歡，真是辛苦妳了餒";
            }
            else {
              env.most_similar_ranked_stores = _.orderBy(env.most_similar_ranked_stores, ['length'], ['asc']);
              env.min_length_store = env.most_similar_ranked_stores[env.sel_index];
              bot_ans = env.user.displayname + '試試看' + env.min_length_store.name + '吧';
            }

            var botMessage = new Message(bot_ans, 'bot');
            this.update(botMessage);
            break;
          }

          case "1005": {
            var botMessage = new Message('謝謝您選擇' + env.min_length_store.name + '！<br />1～10顆星 請評分！', 'bot');
            this.update(botMessage);
            break;
          }
          case "4001": {
            //console.log(env.min_length_store);
            var num = msg.match(/\d+/);

            var rank = {
              item: '',
              rank: num[0],
              store: env.min_length_store.name,
              uid: env.user.uid
            }
            var rank_doc = env.user.uid + env.min_length_store.name;
            this.angularFirestore.collection('ranks').doc(rank_doc).set(rank);

            
            var botMessage = new Message('謝謝您對' + env.min_length_store.name + '的評分！', 'bot');
            this.update(botMessage);
            break;
          }
          default: {
            var botMessage = new Message(speech, 'bot');
            this.update(botMessage);
          }

        }
        // function recommend() {
        //   console.log(localStorage.getItem("userId"));
        // }
        //console.log(bot_ans);
        // const botMessage = new Message(bot_ans, 'bot');
        // this.update(botMessage);
      });
  }



  initUserData() {
    this.fireAuth.user.subscribe(result => {
      this.user.displayname = result.displayName;
      this.user.email = result.email;
      this.user.uid = result.uid;
      //this.initGreeting();

      this.get_users();

    });
  }

  get_ranks() {
    this.httpClient.get('https://icrs-app.herokuapp.com/firebase/ranks').subscribe(result => {
      this.ranks_db = result;
      var arr = this.ranks_db.filter(rank => rank.uid == this.most_similar_user.uid);
      this.most_similar_ranked = _.orderBy(arr, ['rank'], ['desc']);

      this.get_stores();

      // const botMessage = new Message("123", 'bot');
      // this.update(botMessage);
    });
  }

  get_users() {
    var env = this;
    this.httpClient.get('https://icrs-app.herokuapp.com/firebase/users').subscribe(result => {
      this.users_db = result;
      var uid = this.users_db.find(y => y.uid == env.user.uid);
      this.user.pre_breakfast = uid.breakfast;
      this.user.pre_lunch = uid.lunch_dinner;

      var max = 0;

      var evens = _.remove(this.users_db, function(x) {
        return x.uid == env.user.uid;
      });
      
      // console.log(evens);
      // console.log(this.users_db);
      this.users_db.forEach(userdb => {

        var temp_bk = userdb.breakfast.filter(z => env.user.pre_breakfast.indexOf(z) > -1);
        var temp_ld = userdb.lunch_dinner.filter(z => env.user.pre_lunch.indexOf(z) > -1);
        var temp_length = temp_bk.length + temp_ld.length;
        //console.log(temp_length);
        if (temp_length > max) {
          max = temp_length;
          env.most_similar_user = userdb;
        }
      });
     // console.log(env.most_similar_user);
      this.get_ranks();
    });
  }


  get_stores() {
    var env = this;
    this.httpClient.get('https://icrs-app.herokuapp.com/firebase/stores').subscribe(result => {
      this.stores_db = result;
      var temp_stores = this.most_similar_ranked.map(x => x.store);
      
      this.most_similar_ranked_stores = this.stores_db.filter(x => temp_stores.includes(x.name));
      //console.log(this.most_similar_ranked_stores);
      if (this.most_similar_ranked_stores.length==0) {
        this.most_similar_ranked_stores = this.stores_db;
        //console.log(this.most_similar_ranked_stores);
      }
    });
  }




  caclLength(user_long, user_lati, store_long, store_lati) {
    return Math.sqrt(Math.pow((user_long - store_long), 2) + Math.pow((user_lati - store_lati), 2));
  }
}
