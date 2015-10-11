var BandcampVolume = {
    _range:null, // Input range slider (object)
    _audiotags:[], // Audio tags (object array)
    _volSpeaker:null, // Speaker button  (object)
    _lastVol:0.85, // Last saved volume (float)
    _muteValue:null, // volSpeaker next volume (float)
    _saveVol:null, // Whether or not to save volume (bool)
    _slider_change:function(newvol) // Set the audio players to slider value (on event)
    {
        // Set every audio tag's volume to the new volume
        for (var i = 0; i < this._audiotags.length; i++) {
            this._audiotags[i].volume = newvol;
        }

        // Set the spekaer icon to the new volume
        this._volSpeaker_set(newvol);
    },
    _setVolume:function(newvol)
    {
        // Set every audio tag's volume to the new volume
        for (var i = 0; i < this._audiotags.length; i++) {
            this._audiotags[i].volume = newvol;
        }

        // Set the slider to the new volume (For when Mute / Un-Mute button is pressed)
        this._range.value = newvol;

        // Set the spekaer icon to the new volume
        this._volSpeaker_set(newvol);

        // Put it in Chrome's local storage for global persistance if the save volume option is enabled
        if (this._saveVol) chrome.storage.local.set({"volume":newvol});

        // If action was 'Mute', set 'Un-Mute' value to the 'last volume' (previous volume before muting)
        if (newvol == 0) {
            this._muteValue = this._lastVol;
        // If changed to something above '0', set the 'mute' value to '0' and save new volume as the new 'last volume'
        } else if (newvol > 0) {
            this._muteValue = 0;
            this._lastVol = newvol;
        }
    },
    _auto_set:function() // On page load set initial volume
    {
        var bcv = this;
        // Set the volume on page load to either the last stored volume or the default volume of the audio players
        chrome.storage.local.get("volume", function(items) {
            var newvol = items["volume"] || bcv._audiotags[0].volume;

            // JS doesn't distinguish '0' and 'false' unless you tell it to, so make sure it's not just been muted instead of not being set
            if(items["volume"] === 0) newvol = 0;

            // Set the audio players to the initial volume
            for (var i = 0; i < bcv._audiotags.length; i++) {
                bcv._audiotags[i].volume = newvol;
            }

            // Set the slider to the initial volume
            bcv._range.value = newvol;

            // Set the spekaer icon to the initial volume
            bcv._volSpeaker_set(newvol);

            // If initial volume is above '0' set the 'mute' value to '0' and set the 'last volume' to the initial volume
            if (newvol > 0) {
                bcv._lastVol = newvol;
                bcv._muteValue = 0;
            // Otherwise set 'Un-Mute' value to default '0.85' and the 'last volume' will automatically set once Un-Muted
            } else {
                bcv._muteValue = 0.85;
            }
        });
    },
    _volSpeaker_set:function(newvol) // Set speaker button icon based on volume level
    {
        // Set a base class so the string doesn't need to be repeated 4 times
        var classBase = "BandcampVolume_speaker BandcampVolume_icon_volume_";

        // If Un-Muting (or at least changing the volume without setting to '0') set the speaker button's title to 'Mute'
        if (newvol > 0) {
            this._volSpeaker.title = "Mute";

            // Set class according to volume level
            if (newvol > 0.66) {
                this._volSpeaker.className = classBase + "high";
            } else if (newvol > 0.33) {
                this._volSpeaker.className = classBase + "med";
            } else if (newvol > 0) {
                this._volSpeaker.className = classBase + "low";
            }

        // If Muting, set the speaker button title to 'Mute'
        } else if (newvol == 0) {
            this._volSpeaker.className = classBase + "mute";
            this._volSpeaker.title = "Un-Mute";
        }
    },
    _this_page:function() // Return the identified page name
    {
        // If there is no Artist or Label subdomain
        if (document.URL.match(/\/bandcamp.com\//g) == "/bandcamp.com/") {
            if (document.getElementsByTagName("title")[0].text == "Bandcamp")
                return "home"; // Homepage (/)
            else if (document.getElementsByTagName("title")[0].text.match(/Discover/g) == "Discover")
                return "discover"; // Discover Page (/discover)
            else if (document.getElementsByTagName("title")[0].text.match(/Music/g) == "Music")
                return "feed"; // User Feed (/username/feed)
            else if (document.getElementsByTagName("title")[0].text.match(/collection/g) == "collection")
                return "collection"; // User Collection (/username)

        // If there is an Artist or Label subdomain
        } else {
            return "user"; // Album, Artist or Label page
        }

        return null;
    },
    _containerResize:function() // Set volume slider location based on bandcamp page container width
    {
        // Container is different on the homepage than on every other page, so find out which page it is
        var wrapper;
        if (this._this_page() == "home") {
            wrapper = document.getElementsByClassName("home-bd")[0];
        } else {
            wrapper = document.getElementById("centerWrapper");
        }

        // Find the page containers width and set the slider outer container to that width
        var wrapper_style = (wrapper.currentStyle || window.getComputedStyle(wrapper, null));
        var outerContainer = document.getElementsByClassName("BandcampVolume_outer_container")[0];
        outerContainer.style.width = wrapper_style.width;
    },
    _updateSavedVolume: function(saveVol) {
        this._saveVol = saveVol;
        if (saveVol) {
            chrome.storage.local.set({"volume": this._lastVol});
        } else {
            chrome.storage.local.clear();
        }
    },
    load:function() // Main function
    {
        // Make document variable as some functions need it this way (but use this variable for every call instead of 'this')
        var bcv = this;

        // Check to see if the options have updated since the last page load (If they have, they will not apply until the page has finished loading - this is due to chrome.storage being asynchronous)
        window.addEventListener("load", function() {
            chrome.storage.sync.get(function(items) {
                if (items.saveVolume != null && items.saveVolume != undefined) {
                    bcv._updateSavedVolume(items.saveVolume);
                }
            });
        });
        //
        // Listen to see if the volume is changed in chrome.storage, or if the options are updated in chrome.storage.
        chrome.storage.onChanged.addListener(function(changes, name) {
            if (changes.saveVolume != null && name == "sync") {
                bcv._updateSavedVolume(changes.saveVolume.newValue);
            }
        });

        // Find all audio players on the current page and put into object array
        bcv._audiotags = Array.prototype.slice.call(document.getElementsByTagName("audio"));

        // If there are no audio players then don't display Bandcamp Volume
        if (bcv._audiotags.length == 0) return;

        // Find out which page is loaded
        var page = bcv._this_page();

        // Retrieve last saved options from localStorage (Saving them in localStorage means they can be loaded synchronously, and then applied while the page is still loading)
        // The default settings are both true unless the localStorage values are set or the chrome.storage value is updated (This will auto update localStorage and the local variable via _syncVolOptions)
        //bcv._saveVol = localStorage.getItem("saveVolume") || true

        // Create input slider and set attributes
        bcv._range = document.createElement("input");
        bcv._range.className = "BandcampVolume_range";
        bcv._range.type="range";
        bcv._range.max = 1;
        bcv._range.step = 0.01;
        bcv._range.min = 0;

        // Listen for if the slider value is changed, set the audio volume and chrome storage value accordingly
        // (An 'input' event fires the moment the slider changes value, a 'change' event only fires when slider is un-clicked)
        // If we stored the value on 'input' event, this screws up the chrome.storage event listener, as you're trying to change the value while chrome is also trying to change the value
        bcv._range.addEventListener("input", function(event) {
            bcv._slider_change(event.target.value);
        });

        bcv._range.addEventListener("change", function(event) {
            bcv._setVolume(event.target.value);
        });

        // Create speaker button and place in object variable
        bcv._volSpeaker = document.createElement("button");
        bcv._volSpeaker.type = "button";

        // Auto set initial volume and objects
        bcv._auto_set();

        // Listen for if the speaker button is clicked, if so set the audio volume to the muteValue variable and put it in chrome storage
        bcv._volSpeaker.addEventListener("click", function() {
            bcv._setVolume(bcv._muteValue);
        });


        // Create main container div for volume slider and append the speaker button & volume slider to it
        var volcontainer = document.createElement("div");
        volcontainer.appendChild(bcv._volSpeaker);
        volcontainer.appendChild(bcv._range);

        // If current page is an Album, Artist or Label page then set styles and insert slider accordingly
        if (page == "user") {
            volcontainer.className = "BandcampVolume_user_container";

            var desktop_view = document.getElementsByClassName("inline_player")[0];
            desktop_view.querySelector("tr:first-child td:first-child").setAttribute("rowspan", "3");

            var row = document.createElement("tr");
            var col = row.appendChild(document.createElement("td"));
            col.setAttribute("colspan", "3");
            col.appendChild(volcontainer);

            // Inject Bandcamp Volume into page
            desktop_view.querySelector("tbody").appendChild(row);

        // If current page is any other page then set styles and insert slider accordingly
        } else {
            bcv._range.className = bcv._range.className + " BandcampVolume_range_home";

            volcontainer.className = "BandcampVolume_container";

            var outerContainer = document.createElement("div");
            outerContainer.className = "BandcampVolume_outer_container";

            var innerContainer = document.createElement("div");
            innerContainer.className = "BandcampVolume_inner_container";

            var volHover = document.createElement("div");
            volHover.className = "BandcampVolume_hoverBox";
            volHover.className = volHover.className + " icon-volume";

            innerContainer.appendChild(volcontainer);
            innerContainer.appendChild(volHover);
            outerContainer.appendChild(innerContainer);

            // Set wrapper to append to based on type of container (As mentioned before, the homepage has a different container than the other pages)
            var wrapper;
            if (page == "home")
                wrapper = document.getElementsByClassName("home-bd")[0];
            else
                wrapper = document.getElementById("centerWrapper");

            // Inject Bandcamp Volume into page
            wrapper.appendChild(outerContainer);

            // Make sure slider outer container is the same width as the page container, and listen to see if the page container changes width
            bcv._containerResize();
            window.addEventListener("resize", function() {
                bcv._containerResize();
            });
        }
    }
};

BandcampVolume.load();




