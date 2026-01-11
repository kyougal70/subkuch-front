import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {CartService} from '../../core/services/cart.service';
import {OrderService} from '../../core/services/order.service';
import {CreateOrderPayload} from '../../core/models/order.model';
import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://res.cloudinary.com/dvcir66jw/image/upload/v1768065065/ye5es26rv8gsrxsili6i.png',
  iconUrl: 'https://res.cloudinary.com/dvcir66jw/image/upload/v1768065099/njguwdglp83cad1oh6w0.png',
});

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
  lat: number = 28.145;
  lng: number = 76.399;

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

    this.form = this.fb.group({
      customerName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]],
      address: [''], // OPTIONAL
    });

    const savedData = localStorage.getItem('user_details');
    if (savedData) {
      const {customerName, phone, address} = JSON.parse(savedData);
      this.form.patchValue({
        customerName,
        phone: phone?.toString(),
        address,
      });
    }
  }

  ngAfterViewInit() {
    this.initMap();

    // 🔥 Mobile tile fix
    setTimeout(() => this.map.invalidateSize(), 300);
    setTimeout(() => this.map.invalidateSize(), 800);
    setTimeout(() => this.map.invalidateSize(), 1500);
  }

  initMap(lat = 28.145, lng = 76.399) {
    this.lat = lat;
    this.lng = lng;
    console.log(lat, lng)
    this.map = L.map('map', {
      zoomControl: true,
      attributionControl: false,
    }).setView([lat, lng], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
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
    this.lat = lat;
    this.lng = lng;
    console.log(lat, lng)
    this.map.setView([lat, lng], 18);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();

    this.form.patchValue({
      address: data.display_name || `${lat}, ${lng}`,
    });
  }

  useCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        this.lat = lat;
        this.lng = lng;
        console.log(lat, lng)

        this.map.setView([lat, lng], 18);
        await this.setMarker(lat, lng);

        setTimeout(() => this.map.invalidateSize(), 300);
      },
      () => alert('Location permission denied')
    );
  }

  submit() {
    const getUserId = localStorage.getItem('userId');
    if (this.form.invalid || this.loading) return;

    const payload: CreateOrderPayload = {
      items: this.cartService.getCart(),
      netPrice: this.cartService.netPrice(),
      customerName: this.form.value.customerName,
      phone: this.form.value.phone,
      address: this.form.value.address,
      lat: this.lat,
      lng: this.lng,
      userId: getUserId ? +getUserId : undefined
    };

    localStorage.setItem(
      'user_details',
      JSON.stringify(this.form.value)
    );

    this.loading = true;

    this.orderService.createOrder(payload).subscribe((order: any) => {
      this.orderService.saveOrder(order);
      this.cartService.clear();

      this.router.navigate(['/payment']);
    });
  }
}
