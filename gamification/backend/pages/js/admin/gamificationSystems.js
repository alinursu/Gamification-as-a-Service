const deleteSystem = (api_key) => {
    const actionConfirm = confirm("Are you sure you want to delete this Gamification System?");
    if(actionConfirm) {
        location.href = '/admin/gamification-systems/delete?api_key=' + api_key;
    }
}