const deleteSystem = (api_key) => {
    const actionConfirm = confirm("Are you sure you want to delete this Gamification System?");
    if(actionConfirm) {
        location.href = '/admin/gamification-systems/delete?api_key=' + encodeURIComponent(api_key);
    }
}


const updateSystem = (api_key) => {
    location.href = '/admin/gamification-systems/update?api_key=' + encodeURIComponent(api_key);
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