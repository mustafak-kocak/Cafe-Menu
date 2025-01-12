import { Component, OnInit } from '@angular/core';
import { ItemDetails } from 'src/models/item-details';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  //-----------------------//
  // Variables and Objects //
  //-----------------------//
  cartItems: ItemDetails[] = [];
  orderTotal: number = 0;

  constructor(private navCtrl: NavController, private storage: Storage) {}

  ngOnInit() {}

  // Will load the items when we enter the page //
  ionViewWillEnter() {
    this.loadCartItems();
  }

  // Load cart items from storage and calculate total
  loadCartItems() {
    this.storage.get('cart-items').then((value) => {
      if (value) {
        this.cartItems = JSON.parse(value);
        this.updateOrderTotal();
      }
    });
  }

  //-------------//
  // Delete Item //
  //-------------//
  deleteItem(item: ItemDetails) {
    // Remove item from the cart
    const index = this.cartItems.indexOf(item, 0);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }

    // Update the local storage
    this.storage.set('cart-items', JSON.stringify(this.cartItems)).then(() => {
      // After deletion, recalculate total
      this.updateOrderTotal();
    });
  }

  //------------------------------//
  // Update the Total in the cart //
  //------------------------------//
  updateOrderTotal() {
    // Recalculate the order total
    this.orderTotal = this.cartItems.reduce((total, item) => total + item.price, 0);

    // If the cart is empty, navigate to home
    if (this.orderTotal === 0) {
      this.goHome();
    }
  }

  //------------------------------------------------------------------//
  // Return the user to home when they press the button on empty cart //
  //------------------------------------------------------------------//
  goHome() {
    this.navCtrl.navigateRoot('home');
  }
}
