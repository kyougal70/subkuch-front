import {Routes} from '@angular/router';
import {HomeComponent} from '../pages/home/home.component';
import {CartComponent} from '../pages/cart/cart.component';
import {CheckoutComponent} from '../pages/checkout/checkout.component';
import {SuccessComponent} from '../pages/success/success.component';
import {TrackOrderComponent} from '../pages/track-order/track-order.component';
import {AboutComponent} from '../pages/about/about.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'cart', component: CartComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'success', component: SuccessComponent},
  {path: 'track-order/:id', component: TrackOrderComponent},
  {
    path: 'about',
    component: AboutComponent
  }

];
