import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {CartService} from '../../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  cartCount = 0;

  constructor(private cartService: CartService, private router: Router) {
  }

  ngOnInit() {
    this.updateCount();

    // simple polling – MVP acceptable
    setInterval(() => {
      this.updateCount();
    }, 1000);
  }

  updateCount() {
    const items = this.cartService.getCart();
    this.cartCount = items.reduce((sum, i) => sum + i.qty, 0);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goCart() {
    this.router.navigate(['/cart']);
  }
}
