import { Component,ChangeDetectorRef,ViewChild  } from '@angular/core';
import{HomeService,Message}from './home.service';
import{observable, Observable} from 'rxjs';
import { scan } from 'rxjs/operators';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  


  message:Observable<Message[]>;
  input:string = "";

  speech_text = "";

  constructor(
    private homeService:HomeService,
    private speechRecognition: SpeechRecognition,
    private cdRef:ChangeDetectorRef,
    ) {
    }

  ngOnInit(){
    console.log("ngini");
    this.homeService.initUserData();
    this.homeService.initGreeting();
    this.message = this.homeService.conversation.asObservable()
    .pipe(
      scan((acc,val) => acc.concat(val))
    );
  }

  ngAfterViewInit(){
    
    
    console.log("view init");
  }

  ngOnChanges(){
    console.log("on change");
  }

  talk(){
    this.homeService.converse(this.input);
    this.input = '';
  }

  checkPermission(){
    this.speechRecognition.hasPermission().then((hasPermission: boolean) =>{
      if(!hasPermission){
        this.getPermission();
      }
    },
    (err)=>{
      alert(JSON.stringify(err));
    });
  }

  getPermission(){
    this.speechRecognition.requestPermission()
    .then(
      (data) => alert(JSON.stringify(data)),
      (err) => alert(JSON.stringify(err))
    )
  }

  startListening(){
      this.checkPermission();

      this.speechRecognition.startListening()
      .subscribe(
        (speech: string[]) => {
          this.input = speech[0];
          this.cdRef.detectChanges();
        },
        (err) => {
          alert(JSON.stringify(err));
        }
      )
  }

  

}
