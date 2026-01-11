import {Routes} from '@angular/router';
import {HomeComponent} from '../pages/home/home.component';
import {CartComponent} from '../pages/cart/cart.component';
import {CheckoutComponent} from '../pages/checkout/checkout.component';
import {SuccessComponent} from '../pages/success/success.component';
import {AboutComponent} from '../pages/about/about.component';
import {MyOrdersComponent} from '../pages/my-orders/my-orders.component';
import {PaymentComponent} from '../pages/payment/payment.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'cart', component: CartComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'success', component: SuccessComponent},
  {path: 'my-orders', component: MyOrdersComponent},
  {path: 'payment', component: PaymentComponent},
  {
    path: 'about',
    component: AboutComponent
  }

];
