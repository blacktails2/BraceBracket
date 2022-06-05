import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

// Firebase 設定（公開してもよい）
const firebaseConfig = {
  apiKey: "AIzaSyD-Nzhi2nzBgFhoK44B_bnKefnuEXGqgow",
  authDomain: "bracebracket-24d9f.firebaseapp.com",
  databaseURL:
    "https://bracebracket-24d9f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bracebracket-24d9f",
  storageBucket: "bracebracket-24d9f.appspot.com",
  messagingSenderId: "844635716199",
  appId: "1:844635716199:web:afe5e7c533f2604878b2c2",
}

// Firebase の初期化
const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
