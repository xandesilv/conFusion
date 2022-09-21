import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'conFusion';
  gridsize: number = 30;
  updateSetting(event) {
    this.gridsize = event.value;
  }
}
