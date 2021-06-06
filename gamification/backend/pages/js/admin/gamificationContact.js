const deleteContact = (id) => {
    const actionConfirm = confirm("Are you sure you want to delete this Contact Message?");
    if(actionConfirm) {
        location.href = '/admin/contact/delete?id=' + id;
    }
}


const updateContact = (id) => {
    location.href = '/admin/contact/update?id=' + id;
}