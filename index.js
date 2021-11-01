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
    const memberIDs = getSelectedMembers();
    const description = getDescription();
    const endDate = getEndDate();
    const progressStatus = getStatus();
    let count = items.length;

    let newItem = {
        id: count++,
        memberIDs: memberIDs,
        description: description,
        endDate: endDate,
        status: progressStatus
    }
    items.push(newItem);
    insertMiniItem(newItem);
    console.log(items);
}

function viewItemDetails() {
    openNewItemModal();
}

function getMemberUsernamesByIDs(item) {
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
        <div class="css-mini-item js-mini-item" draggable="true" >
            <p class="js-mini-item-description">${newItem.description}</p>
            <div class="css-mini-item-members-btn">
                <p>${members}</p>
                <button class="btn btn-info" onclick="viewItemDetails()">View</button>
            </div>
        </div>`;
    label.insertAdjacentHTML('afterend', descString);
}

function getStatus() {
    const status = document.querySelector(".js-status");
    return status.value;
}

function getEndDate() {
    const endDate = document.querySelector('.js-end-date');
    return endDate.value;
}

function getDescription() {
    const description = document.querySelector(".js-description");
    return description.value;
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


function handleDragStart(e) {
    this.style.opacity = '0.5';
}

function handleDragEnd(e) {
    this.style.opacity = '1';
}

let dndItems = document.querySelectorAll('.js-mini-item');
dndItems.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
});







const members = [
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

let items = [
]


