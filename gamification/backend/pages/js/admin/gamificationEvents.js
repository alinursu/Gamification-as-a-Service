const deleteEvent = (id) => {
    const actionConfirm = confirm("Are you sure you want to delete this Gamification Event?");
    if(actionConfirm) {
        location.href = '/admin/gamification-events/delete?id=' + id;
    }
}


const updateEvent = (id) => {
    location.href = '/admin/gamification-events/update?id=' + id;
}