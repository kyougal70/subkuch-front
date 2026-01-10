import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderService} from '../../core/services/order.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(private orderService: OrderService) {
  }

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.orderService.getMyOrders(+userId).subscribe({
      next: (res: any) => {
        this.orders = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  statusClass(status: string) {
    return status.toLowerCase();
  }
}
