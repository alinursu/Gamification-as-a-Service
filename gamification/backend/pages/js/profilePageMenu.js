function onProfileMenuButtonClick() {
    document.getElementById('profile-menu-div').style.display = "flex";
    document.getElementById('settings-menu-div').style.display = "none";
    document.getElementsByClassName('left-part-row-selected-button')[0].className = 'left-part-row-button';
    document.getElementsByClassName('left-part-row-button')[0].className = 'left-part-row-selected-button';
}

function onSettingsMenuButtonClick() {
    document.getElementById('profile-menu-div').style.display = "none";
    document.getElementById('settings-menu-div').style.display = "flex";
    document.getElementsByClassName('left-part-row-selected-button')[0].className = 'left-part-row-button';
    document.getElementsByClassName('left-part-row-button')[1].className = 'left-part-row-selected-button';
}