const deleteSystem = (api_key) => {
    const actionConfirm = confirm("Are you sure you want to delete this Gamification System?");
    if(actionConfirm) {
        location.href = '/admin/gamification-systems/delete?api_key=' + encodeURIComponent(api_key);
    }
}


const updateSystem = (api_key) => {
    location.href = '/admin/gamification-systems/update?api_key=' + encodeURIComponent(api_key);
}