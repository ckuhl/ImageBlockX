"use strict";


/*
Default settings. If there is nothing in storage, use these values.
*/
var defaultSettings = {
	pattern: "<all_urls>",
	is_blocking: false,
	toggleReload: false,

	title: "Images are allowed",
	icon_path: "icons/image_blocked-32.png"
};

/*
Generic error logger.
*/
function onError(e) {
	console.error(e);
}

/*
On startup, check whether we have stored settings.
If we don't, then store the default settings.
*/
function checkStoredSettings(storedSettings) {
	console.log(storedSettings, defaultSettings);
	if (!storedSettings.pattern ||
			!storedSettings.title ||
			!storedSettings.icon_path) {
		console.log("Stored settings not found, loading default");
		browser.storage.local.set(defaultSettings);
	}
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);




// ==========================================================================

// Reference to current handler
var handler = undefined;


/*
Toggle whether or not to block images
*/
function toggleBlocking(settings) {

	// cancel function returns an object
	// which contains a property `cancel` set to `true`
	function cancelImages(requestDetails) {
		console.log("cancel state is", settings.is_blocking);
		return {cancel: settings.is_blocking};
	}

	if ( handler ) {
		browser.webRequest.onBeforeRequest.removeListener(handler);
	}

	settings.is_blocking = !settings.is_blocking;

	handler = cancelImages;
	browser.webRequest.onBeforeRequest.addListener(
			handler,
			{urls: [settings.pattern], types: ["image", "imageset"]},
			["blocking"]
			);


	if ( settings.is_blocking ) {
		settings.title = "Images are blocked";
		settings.icon_path = "icons/image_blocked-32.png";
	} else {
		settings.title = "Images are allowed";
		settings.icon_path = "icons/image-32.png";
	}

	browser.browserAction
		.setTitle({title: settings.title});
	browser.browserAction
		.setIcon({path: settings.icon_path});

	// Reload page on toggle
	if ( settings.toggleReload ) {
		browser.tabs.reload();
		console.log("Reloading current page");
	}

	console.log(settings);
	browser.storage.local.set(settings);

	return cancelImages
}


/*
Runtime initialization
*/
gettingStoredSettings.then((settings) => {
	browser.browserAction.setTitle({title: settings.title});
	browser.browserAction.setIcon({path: settings.icon_path});
});


/*
On click, get settings and toggle blocking
*/
browser.browserAction.onClicked.addListener(() => {
	var getStoredSettings = browser.storage.local.get();
	getStoredSettings.then(toggleBlocking, onError);
});

