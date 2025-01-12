import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/service/api.service';
import { Storage } from '@ionic/storage';
import { ItemDetails } from 'src/models/item-details';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  menuItems: ItemDetails[] = [];
  cartItems: ItemDetails[] = [];

  constructor(
    private api: ApiService,
    private navCtrl: NavController,
    private storage: Storage,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.refreshMenuItems(); // Sayfa yüklendiğinde ürünleri yenile
  }

  ionViewWillEnter() {
    this.storage.get('cart-items').then(value => {
      let items: ItemDetails[] = [];
      if (value) items = JSON.parse(value);
      this.cartItems = items;
      console.log(value);
    });
  }

  refreshMenuItems() {
    console.log('Refreshing Menu Items');
    this.api.getMenuProducts().then(items => this.menuItems = items);
  }

  openMenuItem(item: any) {
    console.log(`Opening item ${item.name}`);
    this.navCtrl.navigateForward(`product?id=${item.id}`);
  }

  openCart() {
    console.log('Opening Cart');
    this.navCtrl.navigateForward('cart');
  }

  async addNewItem() {
    const alert = await this.alertController.create({
      header: 'Yeni Ürün Ekle',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Ürün Adı'
        },
        {
          name: 'price',
          type: 'number',
          placeholder: 'Fiyat'
        },
        {
          name: 'image',
          type: 'url',
          placeholder: 'Görsel URL'
        },
      ],
      buttons: [
        {
          text: 'İptal',
          role: 'cancel',
          handler: () => {
            console.log('Ürün ekleme iptal edildi');
          }
        },
        {
          text: 'Ekle',
          handler: (data) => {
            const newProduct: ItemDetails = new ItemDetails({
              id : Math.floor(Math.random() * 10000000),
              name: data.name,
              price: parseFloat(data.price),
              description: data.description,
              image: data.image,
              ingredients: ((data.ingredients ?? '').split(',') ?? []).map((ingredient: string) => ingredient.trim())
            });

            this.api.addProduct(newProduct as ItemDetails).then(() => {
              console.log('Yeni ürün başarıyla eklendi!');
              this.refreshMenuItems(); // Ürünleri yenile
            }).catch(error => {
              console.error('Ürün eklenirken bir hata oluştu:', error);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteProduct(productId: any) {
    if (productId == null || productId === undefined) {
      console.error('Geçersiz ürün ID:', productId);
      return;
    }

    console.log('Silinecek ürün ID:', productId);

    this.api.deleteProduct(productId.toString()).then(() => {
      console.log('Ürün başarıyla silindi');
      this.refreshMenuItems();
    }).catch(error => {
      console.error('Ürün silinirken bir hata oluştu:', error);
    });
  }

  addToCart(item: ItemDetails) {
    this.cartItems.push(item);
    this.storage.set('cart-items', JSON.stringify(this.cartItems));
    console.log('Sepete Eklendi:', item);
  }
}
