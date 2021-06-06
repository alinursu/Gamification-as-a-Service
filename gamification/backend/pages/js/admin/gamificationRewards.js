const deleteReward = (id) => {
    const actionConfirm = confirm("Are you sure you want to delete this Gamification Reward?");
    if(actionConfirm) {
        location.href = '/admin/gamification-rewards/delete?id=' + id;
    }
}

const updateReward = (id) => {
    location.href = '/admin/gamification-rewards/update?id=' + id;
}

const importBtn = () => {
    document.getElementById('imported-CSV-file').click()
}

const handleImportFilesChange = () => {
    const node = document.getElementById('imported-CSV-file');
    if(node.files.length > 0) {
        const actionConfirm = confirm("Do you want to import data from file \""+ node.files[0].name + "\"?");
        if(actionConfirm) {
            document.getElementById('import-CSV-submit').click();
        }
    }
}
document.getElementById('imported-CSV-file').addEventListener('change', handleImportFilesChange);