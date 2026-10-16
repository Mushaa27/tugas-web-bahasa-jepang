const familyData = {
    chichi: {
        name: "CHICHI",
        relation: "Ayah",
        photo: "./.vscode/images/chichi.jpeg",
        description: "- これはちちです<br>Kore wa chichi desu<br>- かっこいいです<br>Kakkoii desu<br>- きびしいです<br>Kibishii desu"
    },
    haha: {
        name: "HAHA",
        relation: "Ibu",
        photo: "./.vscode/images/haha.jpeg",
        description: "- これはははです<br>Kore wa haha desu<br>- きれいです<br>Kirei desu<br>- やさしいです<br>Yasashii desu"
    },
    ani: {
        name: "ANI",
        relation: "Kakak laki-laki",
        photo: "./.vscode/images/ani.jpeg",
        description: "- これはあにです<br>Kore wa ani desu<br>- かっこいいです<br>Kakkoii desu<br>- やさしいです<br>Yasashii desu"
    },
    watashi: {
        name: "WATASHI",
        relation: "Saya",
        photo: "./.vscode/images/watashi.jpeg",
        description: "- これはわたしです<br>Kore wa watashi desu<br>- はんさむです<br>Hansamu desu<br>- しずかです<br>Shizuka desu"
    },
    otouto: {
        name: "OTOUTO",
        relation: "Adik laki-laki",
        photo: "./.vscode/images/otouto.jpeg",
        description: "- これはおとうとです<br>Kore wa otouto desu<br>- かわいいです<br>Kawaii desu<br>- あかるいです<br>Akarui desu"
    }
};

const members = document.querySelectorAll(".member");
const memberItems = document.querySelectorAll(".member-item");
const searchInput = document.getElementById("searchInput");
const popup = document.getElementById("memberPopup");
const popupClose = document.getElementById("popupClose");
const popupIcon = document.getElementById("popupIcon");
const popupName = document.getElementById("popupName");
const popupRelation = document.getElementById("popupRelation");
const popupDescription = document.getElementById("popupDescription");
const familyPhotoModal = document.getElementById("familyPhotoModal");
const openFamilyPhoto = document.getElementById("openFamilyPhoto");
const closeFamilyPhoto = document.getElementById("familyPhotoClose");
const mapContainer = document.querySelector(".map-container");
const map = document.querySelector(".map");

function setMemberPhoto(memberElement, photoUrl, altText) {
    if (!memberElement) return;

    const circle = memberElement.querySelector(".member-circle");
    if (!circle) return;

    circle.style.backgroundImage = `url("${photoUrl}")`;
    circle.style.color = "transparent";
    circle.textContent = "";
    circle.setAttribute("aria-label", altText);
}

function openFamilyModal() {
    if (!familyPhotoModal) return;
    familyPhotoModal.classList.add("active");
    familyPhotoModal.setAttribute("aria-hidden", "false");
}

function closeFamilyModal() {
    if (!familyPhotoModal) return;
    familyPhotoModal.classList.remove("active");
    familyPhotoModal.setAttribute("aria-hidden", "true");
}

function showMember(memberId) {
    const data = familyData[memberId];
    if (!data) return;

    popupIcon.innerHTML = `<img src="${data.photo}" alt="${data.name}">`;
    popupName.textContent = data.name;
    popupRelation.textContent = data.relation;
    popupDescription.innerHTML = data.description;
    popup.classList.add("active");
}

function hidePopup() {
    popup.classList.remove("active");
}

function focusMember(member) {
    const memberRect = member.getBoundingClientRect();
    const containerRect = mapContainer.getBoundingClientRect();
    const memberCenterX = memberRect.left + memberRect.width / 2;
    const memberCenterY = memberRect.top + memberRect.height / 2;
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const containerCenterY = containerRect.top + containerRect.height / 2;
    const moveX = containerCenterX - memberCenterX;
    const moveY = containerCenterY - memberCenterY;
    const limited = limitMapPosition(moveX, moveY);

    map.style.setProperty("--move-x", `${limited.x}px`);
    map.style.setProperty("--move-y", `${limited.y}px`);
}

let isDragging = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;

function getMapPosition() {
    const x = parseFloat(getComputedStyle(map).getPropertyValue("--move-x")) || 0;
    const y = parseFloat(getComputedStyle(map).getPropertyValue("--move-y")) || 0;
    currentX = x;
    currentY = y;
}

function limitMapPosition(x, y) {
    const containerWidth = mapContainer.clientWidth;
    const containerHeight = mapContainer.clientHeight;
    const mapWidth = map.offsetWidth;
    const mapHeight = map.offsetHeight;
    const maxX = Math.max(0, (mapWidth - containerWidth) / 2);
    const maxY = Math.max(0, (mapHeight - containerHeight) / 2);
    const limitedX = Math.max(-maxX, Math.min(x, maxX));
    const limitedY = Math.max(-maxY, Math.min(y, maxY));

    return { x: limitedX, y: limitedY };
}

members.forEach(member => {
    const memberId = member.dataset.member;
    const data = familyData[memberId];

    if (!data) return;
    setMemberPhoto(member, data.photo, data.name);
});

if (openFamilyPhoto) {
    openFamilyPhoto.addEventListener("click", openFamilyModal);
}

if (closeFamilyPhoto) {
    closeFamilyPhoto.addEventListener("click", closeFamilyModal);
}

if (familyPhotoModal) {
    familyPhotoModal.addEventListener("click", (event) => {
        if (event.target === familyPhotoModal) {
            closeFamilyModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeFamilyModal();
        }
    });
}

members.forEach(member => {
    member.addEventListener("mouseenter", () => {
        showMember(member.dataset.member);
    });

    member.addEventListener("mouseleave", () => {
        setTimeout(() => {
            if (!popup.matches(":hover")) {
                hidePopup();
            }
        }, 100);
    });

    member.addEventListener("click", (event) => {
        event.stopPropagation();
        const memberId = member.dataset.member;
        showMember(memberId);
    });
});

popup.addEventListener("mouseleave", hidePopup);
popupClose.addEventListener("click", hidePopup);

memberItems.forEach(item => {
    item.addEventListener("click", () => {
        const memberId = item.dataset.member;
        const targetMember = document.querySelector(`.member[data-member="${memberId}"]`);

        if (!targetMember) return;

        members.forEach(member => member.classList.remove("highlight"));
        targetMember.classList.add("highlight");
        showMember(memberId);
        focusMember(targetMember);
    });
});

searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.toLowerCase().trim();

    memberItems.forEach(item => {
        const memberId = item.dataset.member;
        const data = familyData[memberId];
        if (!data) return;

        const searchableText = `${data.name} ${data.relation} ${memberId}`.toLowerCase();
        item.style.display = searchValue === "" || searchableText.includes(searchValue) ? "flex" : "none";
    });

    members.forEach(member => member.classList.remove("highlight"));

    if (searchValue === "") return;

    members.forEach(member => {
        const memberId = member.dataset.member;
        const data = familyData[memberId];
        const searchableText = `${data.name} ${data.relation} ${memberId}`.toLowerCase();

        if (searchableText.includes(searchValue)) {
            member.classList.add("highlight");
        }
    });
});

getMapPosition();

mapContainer.addEventListener("mousedown", (event) => {
    if (event.target.closest(".member-popup")) return;

    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    getMapPosition();
    mapContainer.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    const newX = currentX + deltaX;
    const newY = currentY + deltaY;
    const limited = limitMapPosition(newX, newY);

    map.style.setProperty("--move-x", `${limited.x}px`);
    map.style.setProperty("--move-y", `${limited.y}px`);
});

document.addEventListener("mouseup", () => {
    if (!isDragging) return;

    isDragging = false;
    getMapPosition();
    mapContainer.style.cursor = "grab";
});

mapContainer.addEventListener("touchstart", (event) => {
    if (event.target.closest(".member-popup")) return;

    const touch = event.touches[0];
    isDragging = true;
    startX = touch.clientX;
    startY = touch.clientY;
    getMapPosition();
}, { passive: true });

mapContainer.addEventListener("touchmove", (event) => {
    if (!isDragging) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    const newX = currentX + deltaX;
    const newY = currentY + deltaY;
    const limited = limitMapPosition(newX, newY);

    map.style.setProperty("--move-x", `${limited.x}px`);
    map.style.setProperty("--move-y", `${limited.y}px`);
}, { passive: true });

mapContainer.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;
    getMapPosition();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        hidePopup();
    }
});

