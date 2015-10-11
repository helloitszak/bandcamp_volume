// Saves options to chrome.storage
function save_options() {
  var saveVol = document.getElementById('saveVol').checked;

  chrome.storage.sync.set({
    saveVolume: saveVol
  });
}

// Restores checkbox states using the preferences stored in chrome.storage
function restore_options() {
  var opt = this
  chrome.storage.sync.get({
    saveVolume: true
  }, function(items) {
    document.getElementById('saveVol').checked = items.saveVolume;

    // If it's a first time visit, then these values will not already be set. So, set them.
    opt.save_options();

  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('saveVol').addEventListener('click', save_options);
