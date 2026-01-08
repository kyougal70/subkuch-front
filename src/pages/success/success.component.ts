import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit, OnDestroy {

  orderId!: string;
  countdown = 5;
  timer: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.queryParamMap.get('orderId')!;

    this.timer = setInterval(() => {
      this.countdown--;

      if (this.countdown === 0) {
        this.goToTracking();
      }
    }, 1000);
  }

  goToTracking() {
    clearInterval(this.timer);
    this.router.navigate(['/track-order', this.orderId]);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
}
