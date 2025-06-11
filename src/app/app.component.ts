import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, query, animate } from '@angular/animations';

const fade = trigger('fade', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%',
        opacity: 0,
      }),
    ], { optional: true }),
    query(':enter', [
      animate('700ms ease-in-out', style({ opacity: 1 })),
    ], { optional: true })
  ]),
]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [fade]
})
export class AppComponent {
  title = 'kamak-web';
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
