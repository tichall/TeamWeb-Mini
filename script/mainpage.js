import { initializeFirebase } from "./firebaseInit.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, getDocs} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


// Firebase 인스턴스 초기화
const app = initializeFirebase();
const db = getFirestore(app);

let docs = await getDocs(collection(db, "team_member"));
docs.forEach((doc) => {
    let row = doc.data();
    
    let memberImage = row['memberImage'];
    let memberBlog = row['memberBlog'];
    let memberGithub = row['memberGithub'];
    let memberName = row['memberName'];
    let memberMbti = row['memberMbti'];
    let memberBio = row['memberBio'];

    let temp_html = `
    <div class="card">
            <div class="card-content">
                <div class="imageSec">
                    <div class="image">
                        <img src="${memberImage}" alt="Person 1">
                    </div>
                </div>
                <div class="media-icons">
                    <a href="${memberBlog}" target="_blank"><i class="fa-solid fa-blog blog-icon"></i></a>
                    <a href="${memberGithub}" target="_blank"><i
                            class="fa-brands fa-github github-icon" ></i></a>
                </div>
                <div class="name-profession">
                    <span class="name">${memberName}</span>
                    <span class="tendency">MBTI : ${memberMbti}</span>
                    <span class="promise">"${memberBio}"</span>
                </div>
                <button class="aboutMe" data-id="${doc.id}">상세 정보</button>
            </div>
        </div>
    `;
    $('#member').append(temp_html);
});

// 상세 정보 페이지로 이동
$(document).ready(function () {
    $(".aboutMe").click(function () {
        let userId = $(this).data("id");
        window.location.href = "memberDetail.html?userid=" + userId;
    });
})