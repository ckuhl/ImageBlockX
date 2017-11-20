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
		browser.storage.local.set(defaultSettings);
	}
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);




// ==========================================================================


// toggle whether or not to block images
function toggleBlocking(settings) {

	// cancel function returns an object
	// which contains a property `cancel` set to `true`
	function cancel(requestDetails) {
		return {cancel: settings.is_blocking};
	}

	// add the listener, passing the filter argument and "blocking"
	browser.webRequest.onBeforeRequest.addListener(
			cancel,
			{urls: [settings.pattern], types: ["image"]},
			["blocking"]
			);

	settings.is_blocking = !settings.is_blocking;

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

	console.log(settings.is_blocking);
	browser.storage.local.set(settings);
}


/*
Runtime initialization
*/
gettingStoredSettings.then((settings) => {
	browser.browserAction.setTitle({title: settings.title});
	browser.browserAction.setIcon({path: settings.icon_path});
});


/*
   On click, fetch stored settings and forget browsing data.
   */
browser.browserAction.onClicked.addListener(() => {
	const gettingStoredSettings = browser.storage.local.get();
	gettingStoredSettings.then(toggleBlocking, onError);
});

