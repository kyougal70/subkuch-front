import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {CartService} from '../../core/services/cart.service';
import {OrderService} from '../../core/services/order.service';
import {CreateOrderPayload} from '../../core/models/order.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  loading = false;
  netTotal = 0;
  form!: FormGroup;

  map!: L.Map;
  marker!: L.Marker;

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

    // ✅ 1. Form initialize FIRST
    this.form = this.fb.group({
      customerName: ['', Validators.required],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[6-9][0-9]{9}$/),
        ],
      ],
      address: [''],
    });

    // ✅ 2. Patch localStorage data
    const savedData = localStorage.getItem('user_details');
    if (savedData) {
      const {customerName, phone, address} = JSON.parse(savedData);

      this.form.patchValue({
        customerName,
        phone: phone?.toString(), // IMPORTANT
        address,
      });
    }
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    this.map = L.map('map').setView([28.199, 76.618], 13); // Rewari default

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      this.setMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  async setMarker(lat: number, lng: number) {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }

    // Reverse geocoding
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();

    this.form.patchValue({
      address: data.display_name || `${lat}, ${lng}`
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

    localStorage.setItem(
      'user_details',
      JSON.stringify({
        customerName: this.form.value.customerName,
        phone: this.form.value.phone,
        address: this.form.value.address,
      })
    );

    this.loading = true;

    this.orderService.createOrder(payload).subscribe((order: any) => {
      this.orderService.saveOrder(order);
      this.cartService.clear();

      this.router.navigate(['/success'], {
        queryParams: {orderId: order._id},
      });
    });
  }

  useCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await response.json();

          const address =
            data.display_name ||
            `${lat}, ${lon}`;

          // ✅ Patch address (optional field)
          this.form.patchValue({address});
        } catch (error) {
          console.error('Failed to fetch address', error);
          alert('Unable to fetch address automatically');
        }
      },
      (error) => {
        console.error(error);
        alert('Location permission denied');
      }
    );
  }

}
