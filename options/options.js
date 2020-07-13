"use strict";

// Saves options to chrome.storage
function save_options() {
    var saveVolume = document.getElementById("saveVolume").checked;

    chrome.storage.sync.set({
        saveVolume: saveVolume
    });
}

// Restores checkbox states using the preferences stored in chrome.storage
function restore_options() {
    chrome.storage.sync.get({
        saveVolume: true
    }, function(items) {
        document.getElementById("saveVolume").checked = items.saveVolume;

        // If it's a first time visit, then these values will not already be set. So, set them.
        save_options();
    });
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("saveVolume").addEventListener("click", save_options);
