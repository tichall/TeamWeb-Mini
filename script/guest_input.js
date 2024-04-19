import { initializeFirebase } from "./firebaseInit.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const app = initializeFirebase();
const db = getFirestore(app);

$("#registbtn").click(async function () {
    let name = $('#input-name').val();
    let passwprd = $('#input-password').val();
    let guestbook = $('#input-guestbook').val();
    let today = new Date();
    let formatDate = today.getFullYear().toString().slice(-2)+ "." + (today.getMonth()+1) + "." + today.getDate();

    let doc = {
        'input-name': name,
        'input-password': passwprd,
        'input-guestbook': guestbook, 
        'timestamp': today, 
        'date': formatDate
    };

    await addDoc(collection(db, "guestbook_entries"), doc);

    alert('등록되었습니다!');
    window.opener.postMessage('guestbookSubmitted', '*'); 
    window.close();
});