// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if(listBtnAddFriend.length > 0){
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add");

            const userId = button.getAttribute("btn-add-friend");

            socket.emit("CLIENT_ADD_FRIEND", userId);
        })
    })
}
// Chức năng gửi yêu cầu

// Chức năng huỷ yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if(listBtnCancelFriend.length > 0){
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add");

            const userId = button.getAttribute("btn-cancel-friend");

            socket.emit("CLIENT_CANCEL_FRIEND", userId);
        })
    })
}
// Chức năng huỷ yêu cầu

// Chức năng từ chối kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if(listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("refuse");

            const userId = button.getAttribute("btn-refuse-friend");

            socket.emit("CLIENT_REFUSE_FRIEND", userId);
        });
    });
};
// Chức năng từ chối kết bạn

// Chức năng chấp nhận kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if(listBtnAcceptFriend.length > 0){
    listBtnAcceptFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("accepted");

            const userId = button.getAttribute("btn-accept-friend");

            socket.emit("CLIENT_ACCEPT_FRIEND", userId);
        })
    })
}
// Chức năng chấp nhận kết bạn

//SERVER_RETURN_LENGTH_ACCEPT_FRIEND
const badgeUserAccept = document.querySelector("[badge-users-accept]");
if(badgeUserAccept){
    const userId = badgeUserAccept.getAttribute("badge-users-accept");
    socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
        if(userId === data.userId){
            badgeUserAccept.innerHTML = data.lengthAcceptFriends;
        }
    });
};
//SERVER_RETURN_LENGTH_ACCEPT_FRIEND

//SERVER_RETURN_LENGTH_INFO_FRIEND
socket.on("SERVER_RETURN_LENGTH_INFO_FRIEND", (data) => {
    // Trang accept
    const dataUserAccept = document.querySelector("[data-users-accept]");
    if(dataUserAccept) {
        const userId = dataUserAccept.getAttribute("data-users-accept");
        if(userId == data.userId){
            const newBoxUser = document.createElement("div"); // phải tạo thẻ div thì mới appendChild vào được, không thể appendChild trực tiếp đoạn String
            newBoxUser.classList.add("col-6");
            newBoxUser.setAttribute("user-id", data.infoUserA._id);

            //Vẽ user ra giao diện
            newBoxUser.innerHTML = `
                <div class='box-user'>
                    <div class='inner-avatar'>
                        <img src='/images/avatar.png' alt='${data.infoUserA.fullName}'/>
                    </div>
                </div>
                <div class='inner-info'>
                    <div class='inner-name'>
                        ${data.infoUserA.fullName}
                    </div>
                    <div class='inner-buttons'>
                        <button
                            class='btn btn-sm btn-primary mr-1'
                            btn-accept-friend='${data.infoUserA._id}'
                        > Chấp nhận
                        </button>
                        <button
                            class='btn btn-sm btn-secondary mr-1'
                            btn-refuse-friend='${data.infoUserA._id}'
                        > Xoá
                        </button>
                        <button
                            class='btn btn-sm btn-secondary mr-1'
                            btn-deleted-friend='${data.infoUserA._id}'
                            disabled=''
                        > Đã xoá
                        </button>
                        <button
                            class='btn btn-sm btn-primary mr-1'
                            btn-accepted-friend='${data.infoUserA._id}'
                            disabled=''
                        > Đã chấp nhận
                        </button>
                    </div>
                </div>
            `;

            dataUserAccept.appendChild(newBoxUser);

            //Xoá lời mời kết bạn
            const btnRefuseFriend = newBoxUser.querySelector("[btn-refuse-friend]");
            if(btnRefuseFriend){
                btnRefuseFriend.addEventListener("click", () => {
                    btnRefuseFriend.closest("box-user").classList.add("refuse");

                    const userId = btnRefuseFriend.getAttribute("btn-refuse-friend");

                    socket.emit("CLIENT_REFUSE_FRIEND", userId);
                })
            }

            //Chấp nhận mời kết bạn
            const btnAcceptFriend = newBoxUser.querySelector("[btn-accept-friend]");
            if(btnAcceptFriend){
                btnAcceptFriend.addEventListener("click", () => {
                    btnAcceptFriend.closest("box-user").classList.add("accepted");

                    const userId = btnAcceptFriend.getAttribute("btn-accept-friend");

                    socket.emit("CLIENT_ACCEPT_FRIEND", userId);
                })
            }
        }
    }


    // Trang not-friend
    const dataUserNotFriend = document.querySelector("[data-users-not-friend]");
    if(dataUserNotFriend){
        const userId = dataUserNotFriend.getAttribute("data-users-not-friend");
        if(userId == data.userId){
            const boxUserRemove = dataUserNotFriend.querySelector(`[user-id="${data.infoUserA._id}"]`);
            if(boxUserRemove){
                dataUserNotFriend.removeChild(boxUserRemove);
            }
        }
    }
})
//SERVER_RETURN_LENGTH_INFO_FRIEND


// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
    const dataUsersAccept = document.querySelector("[data-users-accept]");
    const userId = dataUsersAccept.getAttribute("data-users-accept");

    if(userId == data.userId){
        const boxUserRemove = dataUsersAccept.querySelector(`[user-id="${data.userIdA}"]`);
        if(boxUserRemove){
            dataUsersAccept.removeChild(boxUserRemove);
        }
    }
})
// SERVER_RETURN_USER_ID_CANCEL_FRIEND