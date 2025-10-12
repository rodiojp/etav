import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { V6Module } from "./_v6/v6.module";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, V6Module],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'etav';
}
