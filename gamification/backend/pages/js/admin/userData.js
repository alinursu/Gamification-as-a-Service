const deleteUserData = (api_key) => {
    const actionConfirm = confirm("Are you sure you want to delete this User Data?");
    console.log(api_key)
    if (actionConfirm) {
        location.href = '/admin/user-data/delete?api_key=' + encodeURIComponent(api_key);
    }
}


const updateUserData = (api_key, user_id) => {
    location.href = '/admin/user-data/update?api_key=' + encodeURIComponent(api_key) + '&user_id=' + user_id;
}