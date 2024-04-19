import { initializeFirebase } from "./firebaseInit.js";

import { getFirestore, collection, getDocs, updateDoc, deleteDoc, query, where} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const app = initializeFirebase();
const db = getFirestore(app);

$("#editbtn").click(async function () {
    var name = $('#input-name').val();
    var password = $('#input-password').val();

    const q = query(collection(db, "guestbook_entries"), where("input-name", "==", name), where("input-password", "==", password));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
            var data = doc.data();
            var id = doc.id;
            var message = $('#input-guestbook').val();

            if (message.trim() === '') {
                await deleteDoc(doc.ref)
                    .then(() => {
                        alert("방명록이 삭제되었습니다.");
                        window.opener.postMessage("guestbookEdited", "*");
                        window.close();
                    })
                    .catch((error) => {
                        console.error("Error removing document: ", error);
                    });
            } else {
                await updateDoc(doc.ref, {
                    'input-guestbook': message
                })
                .then(() => {
                    alert("방명록이 수정되었습니다.");
                    window.opener.postMessage("guestbookEdited", "*");
                    window.close();
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });
            }
        });
    } else {
        alert("이름 또는 비밀번호가 잘못되었습니다. 수정/삭제를 진행할 수 없습니다.");
    }
});