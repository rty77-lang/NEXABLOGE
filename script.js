let posts =
    JSON.parse(
        localStorage.getItem("communicationPosts")
    ) || [
        {
            id: Date.now(),
            writer: "관리자",
            title: "NEXA 소통기관에 오신 것을 환영합니다.",
            content:
                "이곳에서는 소식, 질문, 의견을 자유롭게 작성할 수 있습니다.",
            date: new Date().toLocaleString("ko-KR"),
            likes: 0
        }
    ];

let popupCloseAllowed = false;
let popupTimer = null;

function savePosts() {
    localStorage.setItem(
        "communicationPosts",
        JSON.stringify(posts)
    );
}

function openWriteBox() {
    const writeBox =
        document.getElementById("writeBox");

    writeBox.classList.remove("hidden");

    document
        .getElementById("writerInput")
        .focus();

    writeBox.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function closeWriteBox() {
    document
        .getElementById("writeBox")
        .classList.add("hidden");

    document.getElementById("writerInput").value = "";
    document.getElementById("titleInput").value = "";
    document.getElementById("contentInput").value = "";
}

function showHome() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function addPost() {
    const writer =
        document
            .getElementById("writerInput")
            .value
            .trim();

    const title =
        document
            .getElementById("titleInput")
            .value
            .trim();

    const content =
        document
            .getElementById("contentInput")
            .value
            .trim();

    if (
        writer === "" ||
        title === "" ||
        content === ""
    ) {
        alert(
            "작성자, 제목, 내용을 모두 입력해 주세요."
        );

        return;
    }

    const newPost = {
        id: Date.now(),
        writer: writer,
        title: title,
        content: content,
        date: new Date().toLocaleString("ko-KR"),
        likes: 0
    };

    posts.unshift(newPost);

    savePosts();
    closeWriteBox();
    renderPosts();
}

function likePost(id) {
    const post = posts.find(function (post) {
        return post.id === id;
    });

    if (!post) {
        return;
    }

    post.likes += 1;

    savePosts();
    renderPosts();
}

function deletePost(id) {
    const answer =
        confirm("이 게시글을 삭제할까요?");

    if (!answer) {
        return;
    }

    posts = posts.filter(function (post) {
        return post.id !== id;
    });

    savePosts();
    renderPosts();
}

function escapeHTML(text) {
    const element =
        document.createElement("div");

    element.textContent = text;

    return element.innerHTML;
}

function renderPosts() {
    const postList =
        document.getElementById("postList");

    const emptyMessage =
        document.getElementById("emptyMessage");

    const searchText =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();

    const sortType =
        document
            .getElementById("sortSelect")
            .value;

    let displayedPosts =
        posts.filter(function (post) {
            const title =
                post.title.toLowerCase();

            const content =
                post.content.toLowerCase();

            const writer =
                post.writer.toLowerCase();

            return (
                title.includes(searchText) ||
                content.includes(searchText) ||
                writer.includes(searchText)
            );
        });

    if (sortType === "likes") {
        displayedPosts.sort(function (a, b) {
            return b.likes - a.likes;
        });
    } else {
        displayedPosts.sort(function (a, b) {
            return b.id - a.id;
        });
    }

    postList.innerHTML = "";

    if (displayedPosts.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    displayedPosts.forEach(function (post) {
        const postCard =
            document.createElement("article");

        postCard.className = "post-card";

        postCard.innerHTML = `
            <h3>${escapeHTML(post.title)}</h3>

            <div class="post-info">
                작성자:
                ${escapeHTML(post.writer)}
                ·
                ${escapeHTML(post.date)}
            </div>

            <div class="post-content">${escapeHTML(post.content)}</div>

            <div class="post-buttons">
                <button
                    class="like-button"
                    onclick="likePost(${post.id})"
                >
                    👍 좋아요 ${post.likes}
                </button>

                <button
                    class="delete-button"
                    onclick="deletePost(${post.id})"
                >
                    삭제
                </button>
            </div>
        `;

        postList.appendChild(postCard);
    });
}

function adClick(adName) {
    alert(adName + "가 클릭되었습니다!");
}

function showPopupAd() {
    const popupAd =
        document.getElementById("popupAd");

    const closeButton =
        document.querySelector(".popup-close");

    const closeTimer =
        document.getElementById("closeTimer");

    popupCloseAllowed = false;

    closeButton.disabled = true;

    popupAd.classList.remove("hidden");

    let seconds = 3;

    closeTimer.textContent =
        seconds + "초 후 닫기 가능";

    clearInterval(popupTimer);

    popupTimer = setInterval(function () {
        seconds -= 1;

        if (seconds > 0) {
            closeTimer.textContent =
                seconds + "초 후 닫기 가능";
        } else {
            clearInterval(popupTimer);

            popupCloseAllowed = true;
            closeButton.disabled = false;

            closeTimer.textContent =
                "이제 광고를 닫을 수 있습니다.";
        }
    }, 1000);
}

function closePopupAd() {
    if (!popupCloseAllowed) {
        return;
    }

    document
        .getElementById("popupAd")
        .classList.add("hidden");
}

function closeBottomAd() {
    document
        .getElementById("bottomAd")
        .classList.add("hidden");
}

savePosts();
renderPosts();

/*
페이지를 연 뒤 4초 후 첫 광고가 뜸
*/
setTimeout(function () {
    showPopupAd();
}, 4000);

/*
그 이후 15초마다 팝업 광고가 뜸
*/
setInterval(function () {
    const popupAd =
        document.getElementById("popupAd");

    if (popupAd.classList.contains("hidden")) {
        showPopupAd();
    }
}, 15000);