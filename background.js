"use strict";

// match pattern for the URLs to redirect
var pattern = "<all_urls>";
var is_blocking = false;

// toggle whether or not to block images
function toggleBlocking() {
	console.log("[imgBlockX] Blocking is now " + (is_blocking ? "on" : "off"))
	is_blocking = !is_blocking;

	if ( is_blocking ) {
		browser.browserAction
		       .setTitle({title: "Images are blocked"});
		browser.browserAction
		       .setIcon({path: "icons/image_blocked-32.png"});
	} else {
		browser.browserAction
		       .setTitle({title: "Images are allowed"});
		browser.browserAction
		       .setIcon({path: "icons/image-32.png"});
	}
}

// register button to toggle image blocking
browser.browserAction
       .onClicked
       .addListener(toggleBlocking);



// cancel function returns an object
// which contains a property `cancel` set to `true`
function cancel(requestDetails) {
  return {cancel: is_blocking};
}

// add the listener,
// passing the filter argument and "blocking"
browser.webRequest.onBeforeRequest.addListener(
  cancel,
  {urls: [pattern], types: ["image"]},
  ["blocking"]
);

