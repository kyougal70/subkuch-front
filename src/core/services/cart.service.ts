import {Injectable} from '@angular/core';
import {OrderItem} from '../models/order.model';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class CartService {
  private key = 'cart';

  getCart(): OrderItem[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }


  addItem(item: OrderItem) {
    const cart = this.getCart();
    const found = cart.find(i => i.productId === item.productId);

    if (found) {
      found.qty++;
      found.totalPrice = found.qty * found.price;
    } else {
      cart.push(item);
    }

    localStorage.setItem(this.key, JSON.stringify(cart));
  }

  updateQty(productId: string, qty: number) {
    const cart = this.getCart();
    const item = cart.find(i => i.productId === productId);
    if (!item) return;

    item.qty = qty;
    item.totalPrice = qty * item.price;
    localStorage.setItem(this.key, JSON.stringify(cart));
  }

  remove(productId: string) {
    const cart = this.getCart().filter(i => i.productId !== productId);
    localStorage.setItem(this.key, JSON.stringify(cart));
  }

  clear() {
    localStorage.removeItem(this.key);
  }

  netPrice() {
    return (this.getCart().reduce((s, i) => s + i.totalPrice, 0) + environment.deliveryFee);
  }
}
