let itemsLocalStorage = []
let membersLocalStorage = [
    {
        id: 1,
        username: "Pera"
    },
    {
        id: 2,
        username: "Zika"
    },
    {
        id: 3,
        username: "Mika"
    },
    {
        id: 4,
        username: "Zarko"
    },
    {
        id: 5,
        username: "Rasko"
    }
]

function initializeLocalStorage() {
    window.localStorage.clear();
    window.localStorage.setItem("initialized", JSON.stringify(false));
    window.localStorage.setItem("items", JSON.stringify(itemsLocalStorage));
    window.localStorage.setItem("members", JSON.stringify(membersLocalStorage));
}

document.addEventListener("DOMContentLoaded", function() {
    let init = window.localStorage.getItem("initialized");
    if (init === null || init === false) {
        initializeLocalStorage();
        window.localStorage.setItem("initialized", JSON.stringify(true));
    }
    let items = JSON.parse(window.localStorage.getItem("items"));
    items.forEach(item => {
        insertMiniItem(item);
    });
});

const newItemModal = document.querySelector(".js-new-item-modal");
const membersTable = document.querySelector(".js-members-table tr");

function closeNewItemModal() {
    newItemModal.style.visibility = "hidden";
}

function openNewItemModal(task) {
    const status = document.querySelector(".js-status");
    const textArea = document.querySelector(".js-description");
    textArea.value = '';
    status.value = task;
    newItemModal.style.visibility = "visible";
}

function submitNewItem() {
    let items = JSON.parse(window.localStorage.getItem("items"));
    const memberIDs = getSelectedMembers();
    const description = getDescription();
    const endDate = getEndDate();
    const progressStatus = getStatus();
    const title = getTitle()
    let count = items.length;

    let newItem = {
        id: count++,
        memberIDs: memberIDs,
        description: description,
        endDate: endDate,
        status: progressStatus,
        title: title
    }
    items.push(newItem);
    window.localStorage.setItem("items", JSON.stringify(items));
    insertMiniItem(newItem);
}

function viewItemDetails(id) {
    openNewItemModal();
    const item = findItem(id);
    const status = document.querySelector(".js-status");
    const endDate = document.querySelector('.js-end-date');
    const description = document.querySelector(".js-description");
    const title = document.querySelector(".js-title");
    
    title.value = item.title;
    status.value = item.status;
    endDate.value = item.endDate;
    description.value = item.description;
    setSelectedMembers(id);
}

function findItem(id) {
    let items = JSON.parse(window.localStorage.getItem("items"));
    items.forEach(element => {
        if(id === element.id){
            item = element;
        }
    });
    return item;
}

function getMemberUsernamesByIDs(item) {
    let members = JSON.parse(window.localStorage.getItem("members"));
    const memberUsernames = [];
    item.memberIDs.forEach(itemMemberID => {
        members.forEach(globalMember => {
            if (itemMemberID === globalMember.id) {
                memberUsernames.push(globalMember.username);
            }
        });
    });
    return memberUsernames;
}

function insertMiniItem(newItem) {
    const label = document.querySelector(`.js-progress-label-${newItem.status}`);
    const members = getMemberUsernamesByIDs(newItem);
    const descString = `
        <div class="css-mini-item css-draggable js-mini-item" id=${newItem.id} draggable="true" ondragstart="onDragStart(event)">
            <p class="js-mini-item-description">${newItem.title}</p>
            <p>End date: ${newItem.endDate}</p>
            <div class="css-mini-item-members-btn">
                <p>${members}</p>
                <button class="btn btn-info" onclick="viewItemDetails(${newItem.id})">View</button>
            </div>
        </div>`;
    label.insertAdjacentHTML('afterend', descString);
}

function getStatus() {
    const status = document.querySelector(".js-status");
    return status.value;
}

function setStatusOnElement(element, statusValue) {
    let items = JSON.parse(window.localStorage.getItem("items"));
    items.forEach(item => {
        if (Number(item.id) === Number(element.id)) {
            item.status = statusValue;
        }
    });
    window.localStorage.setItem("items", JSON.stringify(items));
}

function getEndDate() {
    const endDate = document.querySelector('.js-end-date');
    return endDate.value;
}

function getDescription() {
    const description = document.querySelector(".js-description");
    return description.value;
}

function getTitle() {
    const title = document.querySelector(".js-title");
    return title.value;
}

function setSelectedMembers(itemID) {
    item = findItem(itemID);
    const listOfCheckboxes = document.querySelectorAll(".js-member-checkbox");
    const listOfMemberIDs = item.memberIDs;
    clearCheckBoxes();
    listOfMemberIDs.forEach(memberID => {
        listOfCheckboxes.forEach(ch => {
            if (Number(ch.value) === Number(memberID)) {
                ch.checked = true;
            }
        });
    });
}

function clearCheckBoxes() {
    const listOfCheckboxes = document.querySelectorAll(".js-member-checkbox");
    listOfCheckboxes.forEach(ch => {
        ch.checked = false;
    });
}

function getSelectedMembers() {
    const listOfCheckboxes = document.querySelectorAll(".js-member-checkbox");
    const listOfMemberIDs = [];
    listOfCheckboxes.forEach(ch => {
        if (ch.checked === true){
            listOfMemberIDs.push(Number(ch.value));
        }
    });
    return listOfMemberIDs;
}

function loadMembers() {
    removeSiblingsAfterl(membersTable);
    let members = JSON.parse(window.localStorage.getItem("members"));
    members.forEach(member => {
        const trString = 
            `<tr>
                <td>${member.id}</td>
                <td>${member.username}</td>
                <td><input class="js-member-checkbox" type="checkbox" value=${member.id}></td>
            </tr>
            `;
        membersTable.insertAdjacentHTML('afterend', trString);
    });
}   

function removeSiblingsAfterl(tr)
{
    let nextSibling;
    while (nextSibling=tr.nextSibling) 
        tr.parentNode.removeChild(nextSibling);    
}


function onDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.currentTarget.style.backgroundColor = 'cyan';
}

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {
    const id = event.dataTransfer.getData('text');
    const draggableElement = document.getElementById(id);
    const dropzone = event.target;
    dropzone.appendChild(draggableElement);
    event.dataTransfer.clearData();
    const newStatus = draggableElement.parentElement.id;
    setStatusOnElement(draggableElement, newStatus);
}

// const members = [
//     {
//         id: 1,
//         username: "Pera"
//     },
//     {
//         id: 2,
//         username: "Zika"
//     },
//     {
//         id: 3,
//         username: "Mika"
//     },
//     {
//         id: 4,
//         username: "Zarko"
//     },
//     {
//         id: 5,
//         username: "Rasko"
//     }
// ]

// const items = []