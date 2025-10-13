import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { V6Module } from './_v6/v6.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, V6Module],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
