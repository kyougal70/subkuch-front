import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductService} from '../../core/services/product.service';
import {CartService} from '../../core/services/cart.service';
import {Product} from '../../core/models/product.model';
import {OrderService} from '../../core/services/order.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [
    'all',
    'general',
    'dessert',
    'drinks',
    'snack',
    'bread',
    'nonVeg',
  ];

  selectedCategory = 'all';
  searchText = '';
  loading = true;
  activeOrder: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.fetchProducts();
    this.activeOrder = this.orderService.getActiveOrder();
  }

  goToTracking(orderId: string) {
    this.router.navigate(['/track-order', orderId]);
  }

  getCartQty(productId: string): number {
    const item = this.cartService
      .getCart()
      .find(i => i.productId === productId);
    return item ? item.qty : 0;
  }

  increaseQty(product: Product) {
    this.cartService.addItem({
      productId: product._id,
      productName: product.name,
      productImage: product.image,
      productDescription: product.description,
      productCategory: product.category,
      qty: 1,
      price: product.price,
      totalPrice: product.price,
    });
  }

  decreaseQty(product: Product) {
    const qty = this.getCartQty(product._id);
    if (qty <= 1) {
      this.cartService.remove(product._id);
    } else {
      this.cartService.updateQty(product._id, qty - 1);
    }
  }

  fetchProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res.filter(
          (p) => p.status === 'active' && p.isAvailable
        );
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter((p) => {
      const matchCategory =
        this.selectedCategory === 'all' ||
        p.category === this.selectedCategory;

      const matchSearch =
        p.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        p.description.toLowerCase().includes(this.searchText.toLowerCase());

      return matchCategory && matchSearch;
    });
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.applyFilters();
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchText = input.value;
    this.applyFilters();
  }
}
