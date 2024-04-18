import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, collection, setDoc, getDocs, getDoc, updateDoc} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

import {
    getStorage,
    ref,
    uploadBytesResumable, getDownloadURL, deleteObject
    } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDh6zLnyROVOfCWvNFUc7ZuA8vwcfetQfg",
    authDomain: "sparta-c733d.firebaseapp.com",
    projectId: "sparta-c733d",
    storageBucket: "sparta-c733d.appspot.com",
    messagingSenderId: "1031155272900",
    appId: "1:1031155272900:web:cb870f935defdb8088cd91",
    measurementId: "G-E2LVXM0BPR"
};
  
// 파이어베이스 초기화 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

function getParameterByName(name) {
    var url = new URL(window.location.href);
    return url.searchParams.get(name);
}

let userId = getParameterByName("userid");
const pageRef = doc(db, "team_member", userId);

// 멤버 디테일 페이지 세팅 
export async function displayDetailpage() {
    const snapshot = await getDoc(pageRef);
    const object = snapshot.data();

    // 데이터베이스에 해당 객체 존재하는지 확인
    if (snapshot.exists()) {
        console.log(object);
    } else {
        console.log("err");
    }

    // 각 태그에 해당되는 데이터 세팅 
    $("#memberImg").attr('src', object.memberImage)
    $('#memberName').text(object.memberName);
    $('#line2').html(
        `<span id="memberMbti">#${object.memberMbti}</span>
        <span id="memberTag1">#${object.memberHobby}</span>
        <span id="memberTag2">#${object.memberNickname}</span>`
    );

    $('#memberBio').text(object.memberBio);

    $('#urlBox').html( 
        `<a href="${object.memberBlog}" target="_blank"><i class="fa-solid fa-blog blog-icon" id="blogLink"></i></a>
        <a href="${object.memberGithub}" target="_blank"><i
        class="fa-brands fa-github github-icon" id="githubLink"></i></a>`
        );
        

                
                `<div class="url" id="memberGithub" onclick= "window.open('${object.memberGithub}')"
                >
                    <img src="./Image/github.png">
                </div>
                <div class = "url" id ="memberBlog" onclick= "window.open('${object.memberBlog}')">
                    <img src="./Image/blog.png">
                </div>`
    $('#memberIntro').text(object.memberIntro);
    $('#memberPos1').text(object.memberPos1);
    $('#memberPos2').text(object.memberPos2);
    $('#memberPos3').text(object.memberPos3);
    $('#memberStyle').text(object.memberStyle);

}

// 개인 키 팝업에서 비밀번호 확인 
$("#checkBtn").click(async function() {
    const snapshot = await getDoc(pageRef);
    const object = snapshot.data();
    if ($("#inputPw").val() == object.memberPw) {
        document.getElementById('popupCheck').style.display = 'none';
        document.getElementById('popupEdit').style.display = 'block';
        loadPrev();
    } else {
        $("#failMsg").css("visibility", "visible");
    }
})

// 수정 팝업에서 기존 데이터 띄우기 
export async function loadPrev() {
    const snapshot = await getDoc(pageRef);
    const object = snapshot.data();

    $("#updateImg").attr('src', object.memberImage)
    $("#updateName").val(object.memberName);
    $("#updateMbti").val(object.memberMbti);
    $("#updateHobby").val(object.memberHobby);
    $("#updateNickname").val(object.memberNickname);
    $("#updateBio").val(object.memberBio);
    $("#updateGithub").val(object.memberGithub);
    $("#updateBlog").val(object.memberBlog);
    $("#updateIntro").text(object.memberIntro);
    $("#updatePos1").val(object.memberPos1);
    $("#updatePos2").val(object.memberPos2);
    $("#updatePos3").val(object.memberPos3);
    $("#updateStyle").text(object.memberStyle);
    
};

// 팝업에서 수정 버튼 클릭 시 실행 
$("#update").click(async function (){
    const snapshot = await getDoc(pageRef);
    const object = snapshot.data();
    let file = document.getElementById('editImgSrc').files[0];
    
    // 이미지 파일 변경 없는 경우
    if (file === undefined) {
        let url = object.memberImage;
        setUpdate(url);
    } else {
        // storage에 이미지 파일 저장
        let random = new Date().getTime();
        let storageRef = ref(storage, `reviewImage/${userId}/` + random);
        
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        uploadTask.on('state_changed',
        (snapshot) => {
        console.log('Upload is');
        }, 
        (error) => {
        console.log("업로드 오류 발생");
        }, 
        () => {
            // 이미지 업로드 성공 시 실행 
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                // 기존 storage 이미지 삭제
                const deleteRef = ref(storage, object.memberImage);
                deleteObject(deleteRef).then(() => {
                    console.log("기존 이미지 삭제 완료");
                }).catch((error) => {
                    console.log("기존 이미지 삭제 실패")
                });

                console.log('이미지 업로드 경로', url);
                setUpdate(url);
            });
        }   
        );
    }
    
})

function setUpdate(url) {
    let setData = {
        memberName : $("#updateName").val(),
        memberImage : url,
        memberMbti : $("#updateMbti").val(), 
        memberHobby : $("#updateHobby").val(),
        memberNickname : $("#updateNickname").val(),
        memberBio : $("#updateBio").val(),
        memberGithub : $("#updateGithub").val(),
        memberBlog : $("#updateBlog").val(),
        memberIntro : $("#updateIntro").val(),
        memberPos1 : $("#updatePos1").val(), 
        memberPos2 : $("#updatePos2").val(),
        memberPos3 : $("#updatePos3").val(),
        memberStyle : $("#updateStyle").val()
    };

    updateDoc(pageRef, setData).then(() => {
        alert("수정 완료!");
        
        // 팝업 안 보이게 설정
        document.getElementById('popupCheck').style.display = 'none';
        document.getElementById('popupEdit').style.display = 'none';

        $("#inputPw").val("");
        displayDetailpage();

    }).catch((err) => {
        console.log(err);
        alert("수정 실패");
    });

}





