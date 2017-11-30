function saveOptions(e) {
	browser.storage.local.set({
		toggleReload: document.querySelector("#toggleReload").checked
	});
	e.preventDefault();

	console.log("Options stored from settings");
}

function restoreOptions() {
	var storageItem = browser.storage.local.get('toggleReload');
	storageItem.then((settings) => {
		document.querySelector("#toggleReload").checked = settings.toggleReload;
	});

}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("#toggleReload").addEventListener("change", saveOptions);

