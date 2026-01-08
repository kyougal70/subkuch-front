import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {CartService} from '../../core/services/cart.service';
import {OrderItem} from '../../core/models/order.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  items: OrderItem[] = [];
  netTotal = 0;

  constructor(private cartService: CartService, private router: Router) {
  }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.items = this.cartService.getCart();
    this.netTotal = this.cartService.netPrice();
  }

  increase(item: OrderItem) {
    this.cartService.updateQty(item.productId, item.qty + 1);
    this.loadCart();
  }

  decrease(item: OrderItem) {
    if (item.qty <= 1) {
      this.remove(item.productId);
    } else {
      this.cartService.updateQty(item.productId, item.qty - 1);
      this.loadCart();
    }
  }

  remove(productId: string) {
    this.cartService.remove(productId);
    this.loadCart();
  }

  goToCheckout() {
    if (this.items.length === 0) return;
    this.router.navigate(['/checkout']);
  }
}
