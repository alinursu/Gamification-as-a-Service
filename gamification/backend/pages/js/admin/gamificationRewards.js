const deleteReward = (id) => {
    const actionConfirm = confirm("Are you sure you want to delete this Gamification Reward?");
    if(actionConfirm) {
        location.href = '/admin/gamification-rewards/delete?id=' + id;
    }
}


const updateReward = (id) => {
    location.href = '/admin/gamification-rewards/update?id=' + id;
}