// Saves options to chrome.storage
function save_options() {
  var syncVol = document.getElementById('syncVol').checked;
  var saveVol = document.getElementById('saveVol').checked;

  if(saveVol == false) {
    document.getElementById('syncVol').checked = false;
    document.getElementById('syncVol').disabled = true;
    document.getElementById('syncVolSpan').style.opacity = 0.6;
    syncVol = false;
  } else {
    document.getElementById('syncVol').disabled = false;
    document.getElementById('syncVolSpan').style.opacity = 1;
  }

  chrome.storage.sync.set({
    syncVolume: syncVol,
    saveVolume: saveVol
  });
}

// Restores checkbox states using the preferences stored in chrome.storage
function restore_options() {
  var opt = this
  chrome.storage.sync.get({
    syncVolume: true,
    saveVolume: true
  }, function(items) {
    document.getElementById('saveVol').checked = items.saveVolume;    
    document.getElementById('syncVol').checked = items.syncVolume;
    if(items.saveVolume == false) {
      document.getElementById('syncVol').checked = false;
      document.getElementById('syncVol').disabled = true;
      document.getElementById('syncVolSpan').style.opacity = 0.6;
    } else {
      document.getElementById('syncVol').disabled = false;
      document.getElementById('syncVolSpan').style.opacity = 1;
    }

    // If it's a first time visit, then these values will not already be set. So, set them.
    opt.save_options();

  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('syncVol').addEventListener('click', save_options);
document.getElementById('saveVol').addEventListener('click', save_options);