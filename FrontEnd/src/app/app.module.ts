import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  NbActionsModule,
  NbAlertModule,
  NbButtonModule, NbCardModule, NbContextMenuModule, NbIconModule,
  NbLayoutModule,
  NbMenuModule, NbSelectModule,
  NbSidebarModule,
  NbThemeModule
} from '@nebular/theme';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NbEvaIconsModule} from "@nebular/eva-icons";
import { NotifyComponent } from './notify/notify.component';
import {OverlayPanelModule} from "primeng/overlaypanel";




@NgModule({
  declarations: [
    AppComponent,
    NotifyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NbMenuModule.forRoot(),
    RouterModule, // RouterModule.forRoot(routes, { useHash: true }), if this is your app.module
    NbLayoutModule,
    NbSidebarModule.forRoot(), // NbSidebarModule.forRoot(), //if this is your app.module
    NbButtonModule,
    NbButtonModule,
    NbThemeModule.forRoot({name: 'default'}),
    NbAlertModule,
    NbActionsModule,
    NbEvaIconsModule,
    NbContextMenuModule,
    OverlayPanelModule,
    NbIconModule,
    NbCardModule,
    NbSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
