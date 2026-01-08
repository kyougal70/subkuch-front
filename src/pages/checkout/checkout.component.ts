import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {CartService} from '../../core/services/cart.service';
import {OrderService} from '../../core/services/order.service';
import {CreateOrderPayload} from '../../core/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  loading = false;
  netTotal = 0;
  form!: FormGroup; // <-- declare only

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
  }

  ngOnInit() {
    const cartItems = this.cartService.getCart();
    if (cartItems.length === 0) {
      this.router.navigate(['/']);
      return;
    }

    this.netTotal = this.cartService.netPrice();

    // ✅ Initialize form here
    this.form = this.fb.group({
      customerName: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid || this.loading) return;

    const payload: CreateOrderPayload = {
      items: this.cartService.getCart(),
      netPrice: this.cartService.netPrice(),
      customerName: this.form.value.customerName,
      phone: this.form.value.phone,
      address: this.form.value.address,
    };

    this.loading = true;

    this.orderService.createOrder(payload).subscribe((order: any) => {
      this.orderService.saveOrder(order);

      this.cartService.clear();
      this.router.navigate(['/success'], {
        queryParams: {orderId: order._id}
      });
    });
  }
}
