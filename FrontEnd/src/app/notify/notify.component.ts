import { Component, OnInit } from '@angular/core';
import {NbComponentSize, NbMenuService} from "@nebular/theme";
import * as SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';



@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.css']
})
export class NotifyComponent implements OnInit{
  content: any = [{}];
  emptyTable: any = [{}];
  items = [{ title: 'Profile' }, { title: 'Log out' }];
  sizes: NbComponentSize[] = [ 'tiny', 'small', 'medium', 'large', 'giant' ];

  public notifications: any;
  public body: any;
  private client!: StompJs.Client;
  public refreshedNotifs: any;
  bellClicked = false;
  texte: any;
  display = false;




  constructor(private menuService: NbMenuService) { }

  ngOnInit() {
    this.refreshedNotifs=localStorage.getItem("count");
  }

  connectClicked() {
    if (!this.client || this.client.connected) {
      this.client = new StompJs.Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/notifications'),
        debug: (msg: string) => console.log(msg)
      });

      this.client.onConnect = () => {

        console.info('connected!');
        this.client.publish({destination: '/swns/start'});
      };

      this.client.onStompError = (frame) => {
        console.error(frame.headers['message']);
        console.error('Details:', frame.body);
      };

      this.client.activate();
    }
  }

  disconnectClicked() {
    if (this.client && this.client.connected) {
      this.client.publish({destination: '/swns/stop'});
      this.client.deactivate();
      //this.client = null;
      console.info("disconnected :-/");
    }
  }

  startClicked() {
    if (this.client && this.client.connected) {
      this.client.publish({destination: '/swns/trigger'});
      console.log("Published and ready for subscription")
      this.client.subscribe('/user/notification/item', (response) => {
        const text: Array<string> = JSON.parse(response.body).text;
        console.log("This is the text from backend",text);
        this.content = ({title: text});
        console.log(this.content);
        const count: any = JSON.parse(response.body).count;
        this.notifications = count;
        JSON.stringify(localStorage.setItem("count",count));
        this.refreshedNotifs = localStorage.getItem("count");
        //this.body = text;
      });
      //this.content.push({title:this.texte});
      //console.log(this.content);
    }
  }

  stopClicked() {
    if (this.client && this.client.connected) {
      this.client.publish({destination: '/swns/stop'});
    }
  }
  setToZero(){
    if (this.client && this.client.connected) {
      this.client.publish({destination: '/swns/setzero'});
      console.log("Setting to zero..")
      this.client.subscribe('/user/notification/item', (response) => {
        const count: any = JSON.parse(response.body).count;
        localStorage.setItem("count",count);
        this.refreshedNotifs = localStorage.getItem("count");
        this.bellClicked = true
        if (this.bellClicked == true){
          //this.content = this.emptyTable;
          //console.log("table cleared");
        }
        this.notifications = count;
      });
    }
  }

  showContents(): void{
    this.display == true;
    console.log("aaaaaa")
  }


}
