import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";

export function initializeFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyDx0t5JFwPcrDnqFICKyrrML2N1I60fWn0",
        authDomain: "teamwebpage-51e54.firebaseapp.com",
        projectId: "teamwebpage-51e54",
        storageBucket: "teamwebpage-51e54.appspot.com",
        messagingSenderId: "349501855402",
        appId: "1:349501855402:web:12e8c26e7a8cbad03ba2d3"
    };

    // 파이어베이스 초기화 
    return initializeApp(firebaseConfig);

}
