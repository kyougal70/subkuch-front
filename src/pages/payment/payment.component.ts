import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {OrderService} from '../../core/services/order.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  order: any;
  netAmount = 0;

  paymentMode: 'cod' | 'online' | null = null;

  onlinePaidAmount!: number;
  uploading = false;
  screenshotUrl = '';
  amountError = false;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {
  }

  ngOnInit() {
    const order1 = this.orderService.getOrders();
    this.order = order1[order1.length - 1];
    if (!this.order) {
      this.router.navigate(['/']);
      return;
    }
    this.netAmount = this.order.netPrice;
  }

  selectMode(mode: 'cod' | 'online') {
    this.paymentMode = mode;
  }

  validateAmount() {
    if (this.onlinePaidAmount > this.netAmount) {
      this.amountError = true;
      this.onlinePaidAmount = this.netAmount;
    } else {
      this.amountError = false;
    }
  }


  async uploadScreenshot(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'sabkuch_unsigned');

    this.uploading = true;

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/dvcir66jw/image/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await res.json();
    this.screenshotUrl = data.secure_url;
    this.uploading = false;
  }

  confirmCOD() {
    this.router.navigate(['/success'], {
      queryParams: {orderId: this.order.orderId},
    });
  }

  submitOnlinePayment() {
    if (this.onlinePaidAmount > this.netAmount) {
      alert(`Amount cannot exceed ₹${this.netAmount}`);
      return;
    }

    if (!this.onlinePaidAmount || !this.screenshotUrl) {
      alert('Please enter amount and upload screenshot');
      return;
    }

    this.orderService
      .updateOnlinePayment(this.order.orderId, {
        paymentScreenShot: this.screenshotUrl,
        onlinePaidAmount: this.onlinePaidAmount,
      })
      .subscribe(() => {
        this.router.navigate(['/success'], {
          queryParams: {orderId: this.order.orderId},
        });
      });
  }
}
