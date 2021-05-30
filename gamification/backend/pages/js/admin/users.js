const deleteUser = (id) => {
    const actionConfirm = confirm("Are you sure you want to delete this user?");
    if(actionConfirm) {
        location.href = '/admin/users/delete?id=' + id;
    }
}