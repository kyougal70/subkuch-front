import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {interval, Subscription} from 'rxjs';
import {OrderService} from '../../core/services/order.service';
import {NgForOf, NgIf, TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  imports: [
    NgIf,
    TitleCasePipe,
    NgForOf
  ],
  styleUrls: ['./track-order.component.css']
})
export class TrackOrderComponent implements OnInit, OnDestroy {

  orderId!: string;
  order: any;
  pollingSub!: Subscription;

  statusSteps = [
    'pending',
    'preparing',
    'ready',
    'outForDelivery',
    'delivered'
  ];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {
  }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id')!;

    // initial fetch
    this.fetchOrder();

    // poll every 5 seconds
    this.pollingSub = interval(5000).subscribe(() => {
      this.fetchOrder();
    });
  }

  fetchOrder() {
    this.orderService.getOrderById(this.orderId).subscribe((order: any) => {
      this.order = order;
      this.orderService.updateOrderStatus(order._id, order.status);
    });
  }

  isCompleted(step: string): boolean {
    return (
      this.statusSteps.indexOf(step) <
      this.statusSteps.indexOf(this.order?.status)
    );
  }

  isActive(step: string): boolean {
    return step === this.order?.status;
  }

  ngOnDestroy(): void {
    if (this.pollingSub) this.pollingSub.unsubscribe();
  }
}
