import { Component, OnInit } from '@angular/core';
import {NbComponentSize} from "@nebular/theme";
import * as SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';


@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.css']
})
export class NotifyComponent {
  content: any = [{}];
  items = [{ title: 'Profile' }, { title: 'Log out' }];
  sizes: NbComponentSize[] = [ 'tiny', 'small', 'medium', 'large', 'giant' ];

  public notifications: any;
  public body: any;
  private client!: StompJs.Client;

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
        const text: string = JSON.parse(response.body).text;
        const count: number = JSON.parse(response.body).count;
        this.notifications = count;
        this.content.push({title:text});
        console.log(this.content)
        this.body = text;
      });
    }
  }

  stopClicked() {
    if (this.client && this.client.connected) {
      this.client.publish({destination: '/swns/stop'});
    }
  }

}
