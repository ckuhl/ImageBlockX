"use strict";


// On startup, check whether we have stored settings.
// If we don't, then store the default settings.
const checkStoredSettings = (storedSettings) => {
    const defaultState = {
        pattern: "<all_urls>",
        isBlocking: false,
        isReloadingOnToggle: false,

        ui: {
            windowDetails: {
                title: "Images are allowed",
            },
            icon: {
                path: "icons/image-32.png",
            },
        },
    };

    if (!storedSettings.pattern ||
        !storedSettings.windowDetails ||
        !storedSettings.icon) {
        console.debug("Stored settings not found, loading default");
        browser.storage.local.set(defaultState).then(() => console.debug("Default settings loaded"));
    }
};

const updateState = (state) => {
    if (state.isBlocking) {
        state.ui = {
            windowDetails: {
                title: "Images are blocked",
            },
            icon: {
                path: "icons/image_blocked-32.png",
            },
        }
    } else {
        state.ui = {
            windowDetails: {
                title: "Images are allowed",
            },
            icon: {
                path: "icons/image_allowed-32.png",
            },
        }
    }
    return state;
};

const updateUI = (state) => {
    browser.browserAction.setIcon(state.ui.icon).then();
    browser.browserAction.setTitle(state.ui.windowDetails).then();
};


// The current blocking handler
let handler = undefined;


// Toggle whether or not to block images
const toggleBlocking = (settings) => {
    const blockingHandler = (requestDetails) => {
        return {
            cancel: settings.isBlocking
        };
    };

    if (handler) {
        browser.webRequest.onBeforeRequest.removeListener(handler);
    }

    settings.isBlocking = !settings.isBlocking;

    handler = blockingHandler;
    browser.webRequest.onBeforeRequest.addListener(
        handler,
        {
            urls: [
                settings.pattern
            ],
            types: [
                "image",
                "imageset"
            ]
        },
        [
            "blocking"
        ]
    );

    settings = updateState(settings);
    updateUI(settings);

    // Reload page on toggle
    if (settings.isReloadingOnToggle) {
        browser.tabs.reload().then(
            () => console.debug("Current page reloaded..."),
            (e) => console.error(e));
    }

    browser.storage.local.set(settings).then(
        () => console.debug("Settings saved"),
        (e) => console.error(e));

    return blockingHandler;
};


(() => {
    browser.storage.local.get().then((settings) => {
            checkStoredSettings(settings);
            updateState(settings);
            updateUI(settings);
        },
        (e) => console.error(e));

    // On click, get settings and toggle blocking
    browser.browserAction.onClicked.addListener(() => {
        browser.storage.local.get().then(
            (settings) => toggleBlocking(settings),
            (e) => console.error(e));
    });
})();
