"use strict";

/**
 * UI state structure
 * @typedef {{windowDetails: {title: string}, icon: {path: string}}} ImageBlockXUiState
 */

/**
 * Entire web extension state structure
 * @typedef {{isBlocking: boolean, ui: ImageBlockXUiState, pattern: string, isReloadingOnToggle: boolean}} ImageBlockXState
 */

/**
 * Handler function that determines whether or not to block images
 * @typedef {function(*): {cancel: boolean}} BlockingHandler
 */


/**
 * On startup, check whether we have stored settings.
 * If we don't, then store and return the default settings.
 *
 * @param {ImageBlockXState} storedSettings - the settings as found in the browser local storage
 * @return {ImageBlockXState} storedSettings if valid, the default settings otherwise.
 */
const checkStoredSettings = storedSettings => {
    /** @type {ImageBlockXState} */
    const defaultState = {
        pattern: "<all_urls>",
        isBlocking: false,
        isReloadingOnToggle: false,

        ui: {
            windowDetails: {
                title: "Images are allowed",
            },
            icon: {
                path: "icons/image_allowed.svg",
            },
        },
    };

    // TODO: Find way to merge settings if incomplete (how could that happen however?)
    if (!("pattern" in storedSettings) ||
        !("isBlocking" in storedSettings) ||
        !("isReloadingOnToggle" in storedSettings) ||
        !("ui" in storedSettings)) {
        console.debug("Stored settings not found, loading default");
        browser.storage.local.set(defaultState).then(
            () => console.debug("Default settings loaded")
        );

        return defaultState;
    } else {
      console.debug("Valid stored settings found.");

      return storedSettings;
    }
};

/**
 * TODO: What does this do?
 *
 * @param {ImageBlockXState} state
 * @returns {ImageBlockXState} The modified settings
 */
const updateState = (state) => {
    if (state.isBlocking) {
        state.ui = {
            windowDetails: {
                title: "Images are blocked",
            },
            icon: {
                path: "icons/image_blocked.svg",
            },
        }
    } else {
        state.ui = {
            windowDetails: {
                title: "Images are allowed",
            },
            icon: {
                path: "icons/image_allowed.svg",
            },
        }
    }
    return state;
};

/**
 * TODO: What type is this?
 * TODO: Return whether or not this succeeded?
 *
 * @param {ImageBlockXState} state
 */
const updateUI = (state) => {
    browser.browserAction.setIcon(state.ui.icon).then();
    browser.browserAction.setTitle(state.ui.windowDetails).then();
};


/**
 * The active blocking handler function
 * TODO: Can this be initialized to something not-null?
 *
 * @type BlockingHandler
 */
let handler = undefined;


/**
 * Toggle whether or not to block images
 *
 * @param {ImageBlockXState} settings
 * @returns BlockingHandler
 */
const toggleBlocking = settings => {
    /**
     * Handler that the browser calls when loading any resource
     *
     * @param {*} requestDetails
     * @returns {{cancel: boolean}}
     */
    const blockingHandler = requestDetails => {
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
    updateUI(settings); // TODO: Get rid of void method

    // Reload page on toggle
    if (settings.isReloadingOnToggle) {
        browser.tabs.reload().then(
            () => console.debug("Current page reloaded..."),
            e => console.error(e)
        );
    }

    browser.storage.local.set(settings).then(
        () => console.debug("Settings saved"),
        e => console.error(e)
    );

    return blockingHandler;
};


(() => {
    browser.storage.local.get().then(
        settings => {
            settings = checkStoredSettings(settings);
            updateState(settings);
            updateUI(settings);

            // TODO: a hack to register the blocking handler.
            toggleBlocking(settings);
            toggleBlocking(settings);
        },
        e => console.error(e));

    // On click, get settings and toggle blocking
    browser.browserAction.onClicked.addListener(() => {
        browser.storage.local.get().then(
            settings => toggleBlocking(settings),
            e => console.error(e));
    });
})();
