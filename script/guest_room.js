import { initializeFirebase } from "./firebaseInit.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const app = initializeFirebase();
const db = getFirestore(app);
let entryNumber = 0;

async function populateTable() {
    const snap = collection(db, "guestbook_entries")
    const querySnapshot = await getDocs(query(snap, orderBy("timestamp", "desc")));
    
    document.querySelector("tbody").innerHTML = "";  

    querySnapshot.forEach((doc) => {
        const name = doc.data()["input-name"];
        const guestbook = doc.data()["input-guestbook"];
        const date = doc.data()["date"];

        const newRow = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = name;
        newRow.appendChild(nameCell);

        const guestbookCell = document.createElement("td");
        guestbookCell.textContent = guestbook;
        newRow.appendChild(guestbookCell);

        const dateCell = document.createElement("td");
        dateCell.textContent = date;
        newRow.appendChild(dateCell);

        document.querySelector("tbody").appendChild(newRow);
        entryNumber++;
    });
    
    $("#showNum").text("총 " + entryNumber + "개의 방명록이 있습니다!");
}

window.addEventListener('message', async (event) => {
    if (event.data === 'guestbookSubmitted') {
        await populateTable();
    } else if (event.data === 'guestbookEdited') {
        await populateTable();
    }
});

populateTable();