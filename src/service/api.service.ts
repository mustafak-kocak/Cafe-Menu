import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemDetails } from 'src/models/item-details'; // ItemDetails modelini import ediyoruz
import { initializeApp } from "firebase/app";
import { deleteDoc, doc, Firestore, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { collection, getDocs, setDoc } from "firebase/firestore"; // addDoc kullanıyoruz


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private db: Firestore;

  constructor(private http: HttpClient) {
    const firebaseConfig = {
      apiKey: "......",
      authDomain: "......",
      projectId: ".....",
      storageBucket: "......",
      messagingSenderId: ".....",
      appId: ".....",
      measurementId: "....."
    };

    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }


  async getMenuProducts(): Promise<ItemDetails[]> {
    const querySnapshot = await getDocs(collection(this.db, "urunler"));
    return querySnapshot.docs.map(item => new ItemDetails(item.data())) as ItemDetails[];
  }


  async getProductDetails(id: string): Promise<ItemDetails> {
    const docSnap = await getDoc(doc(this.db, 'urunler', id));
    return new ItemDetails(docSnap.data());
  }


  async addProduct(product: ItemDetails): Promise<void> {
    const docRef = doc(this.db, "urunler/" + product.id);
    await setDoc(docRef, { ...product });
  }


async deleteProduct(productId: string): Promise<void> {
  try {
    const productRef = doc(this.db, `urunler/${productId}`)
    await deleteDoc(productRef);
    console.log('Ürün başarıyla silindi!');
  } catch (error) {
    console.error('Ürün silinirken bir hata oluştu:', error);
    throw error;
  }
}
}
