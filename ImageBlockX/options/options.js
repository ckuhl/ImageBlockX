/** @type {string} */
const reloadingSetting = 'isReloadingOnToggle';

/** @type {string} */
const reloadingElementToggle = 'toggleReload';


(() => {
    /**
     * TODO: How to assert that I know this is an HTMLInputElement?
     *
     * @type {HTMLElement}
     */
    const element = document.getElementById(reloadingElementToggle);

    // Get options on page load
    document.addEventListener(
        'DOMContentLoaded',
        () => {
            browser.storage.local.get(reloadingSetting).then(
                settings => {
                    element.checked = settings.isReloadingOnToggle;
                }
            ).then(
                () => console.debug('Options loaded from storage')
            )
        }
    );

    // Save options on change
    element.addEventListener(
        'change',
        e => {
            browser.storage.local.set(
                {
                    reloadingSetting: element.checked
                }
            ).then(
                () => console.debug('Options stored from settings')
            );
            e.preventDefault();
        }
    );
})();
