import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CreateOrderPayload} from '../models/order.model';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class OrderService {
  private STORAGE_KEY = 'my_orders';

  constructor(private http: HttpClient) {
  }

  createOrder(payload: CreateOrderPayload) {
    return this.http.post(`${environment.apiUrl}/orders`, payload);
  }

  getOrderById(id: string) {
    return this.http.get(`${environment.apiUrl}/orders/${id}`);
  }

  getActiveOrder() {
    const orders = this.getOrders();

    return orders.find((o: any) =>
      !['delivered', 'cancelled', 'cancelledByCustomer', 'cancelledByRestaurant']
        .includes(o.status)
    );
  }

  saveOrder(order: any) {
    const orders = this.getOrders();

    orders.push({
      orderId: order._id,
      status: order.status,
      netPrice: order.netPrice,
      createdAt: order.createdAt,
    });

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
  }

  getOrders() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  updateOrderStatus(orderId: string, status: string) {
    const orders = this.getOrders().map((o: any) =>
      o.orderId === orderId ? {...o, status} : o
    );

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
  }
}
