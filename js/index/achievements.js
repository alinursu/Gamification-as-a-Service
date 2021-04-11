function changeToBuyers()
{
    document.getElementById('sellersAchievementsBtn').className = document.getElementById('sellersAchievementsBtn').className.replace(' selected-achievements-menu-button', '');
    document.getElementById('buyersAchievementsBtn').className += ' selected-achievements-menu-button';
    document.getElementById('sellers-achievements-container').style.display = 'none';
    document.getElementById('buyers-achievements-container').style.display = 'grid';
}

function changeToSellers()
{
    document.getElementById('buyersAchievementsBtn').className = document.getElementById('buyersAchievementsBtn').className.replace(' selected-achievements-menu-button', '');
    document.getElementById('sellersAchievementsBtn').className += ' selected-achievements-menu-button';
    document.getElementById('sellers-achievements-container').style.display = 'grid';
    document.getElementById('buyers-achievements-container').style.display = 'none';
}

function initAchievements()
{
    changeToSellers();
}