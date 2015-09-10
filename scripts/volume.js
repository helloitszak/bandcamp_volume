var BandcampVolume = 
{
    _ranges:[],
    _audiotag:null,
    _volSpeaker:null,
    _lastVol:null,
    _slider_lastVol:null,
    _slider_change:function(evt)
    {
        var vol = parseFloat(evt.target.value)
        // Set the audio tag's volume to the slider's volume
        this._audiotag.volume = vol

        this._volSpeaker_set(vol)

        //if(vol > 0) this._volSpeaker.value = 0
    },
    _slider_set:function(evt)
    {
        // Get the value of the input
        var newvol = parseFloat(evt.target.value)

        // Put it in Chrome's local storage for global persistance
        chrome.storage.local.set({"volume":newvol})

        // Yes I know I am going to set the slider that's triggering this event to it's own value.
        this._ranges.forEach(function(element, index, array)
        {
            element.value = newvol
        })

        if (evt.target.className.match(/range/g) == "range") {
            if (newvol == 0) {
                if(this._slider_lastVol > 0)
                    this._volSpeaker.value = this._slider_lastVol
                else
                    this._volSpeaker.value = 0.8
            } else if (newvol > 0) {
                this._volSpeaker.value = 0
            }
            this._slider_lastVol = newvol
        }
    },
    _set_volume_evt:function(evt)
    {
        var vol = parseFloat(evt.target.value)

        this._lastVol = this._audiotag.volume

        this._slider_change(evt)
        this._slider_set(evt)

        if(evt.target.className.match(/label/g) == "label") {
            if(vol == 0 && this._lastVol > 0) {
                this._volSpeaker.value = this._lastVol
            } else if(vol > 0) {
                this._volSpeaker.value = 0
            }
        }

    },
    _auto_set:function(bcv) 
    {
        chrome.storage.local.get("volume", function(items) {
            var newvol = items["volume"] || bcv._audiotag.volume

            bcv._ranges.forEach(function(element, index, array)
            {
                element.value = newvol
            })
            bcv._audiotag.volume = newvol
            bcv._volSpeaker_set(newvol)
            if(newvol > 0) bcv._volSpeaker.value = 0
        })
    },
    _volSpeaker_set:function(volume) 
    {
        if(volume > 0) {
            this._volSpeaker.title = "Mute" 
            if(volume > 0.66) {
                this._volSpeaker.className = "BandcampVolume_label BandcampVolume_icon_volume_high"
            } else if (volume > 0.33) {
                this._volSpeaker.className = "BandcampVolume_label BandcampVolume_icon_volume_med"
            } else if (volume > 0) {
                this._volSpeaker.className = "BandcampVolume_label BandcampVolume_icon_volume_low"
            }
        } else if (volume == 0) {
            this._volSpeaker.className = "BandcampVolume_label BandcampVolume_icon_volume_mute"
            this._volSpeaker.title = "Un-Mute"
        }
    },
    _this_page:function()
    {
        if(document.URL.match(/\/bandcamp.com\//g) == "/bandcamp.com/") {
            if(document.getElementsByTagName("title")[0].text == "Bandcamp") {
                //Homepage (/)
                return "home"
            } else if(document.getElementsByTagName("title")[0].text.match(/Discover/g) == "Discover") {
                //Discover Page (/discover)
                return "discover"
            } else if (document.getElementsByTagName("title")[0].text.match(/Music/g) == "Music") {
                //User Feed (/username/feed)
                return "feed"
            } else if (document.getElementsByTagName("title")[0].text.match(/collection/g) == "collection") {
                //User Collection (/username)
                return "collection"
            }
        } else {
            //album or artist page
            return "user"
        }

        return null
    },
    load:function()
    {
        var page = this._this_page()
        if(page == "discover" || page == "feed" || page == "user")
            this._audiotag = document.getElementsByTagName("audio")[0]
        else if(page == "home")
            this._audiotag = document.getElementsByTagName("audio")[4]

        var desktop_view = document.getElementsByClassName("inline_player")[0]

        if(page == "user") {
            // Create the volume layout
            desktop_view.querySelector("tr:first-child td:first-child").setAttribute("rowspan", "3")

            var row = document.createElement("tr")
            var col = row.appendChild(document.createElement("td"))
            col.setAttribute("colspan", "3")
        } else if (page == "home") {

        }

        var volcontainer = document.createElement("div")
        if(page == "user") {
            volcontainer.className = "BandcampVolume_user_container"
        } else {
            volcontainer.className = "BandcampVolume_container"

            var outerContainer = document.createElement("div")
            outerContainer.className = "BandcampVolume_outer_container"

            var innerContainer = document.createElement("div")
            innerContainer.className = "BandcampVolume_inner_container"

            var volHover = document.createElement("div")
            volHover.className = "BandcampVolume_hoverBox"
            volHover.className = volHover.className + " icon-volume"
        }

        this._volSpeaker = document.createElement("button")
        this._volSpeaker.type = "button"
        this._auto_set(this)

        // Get some stuff from the player progress bar to add style to the volume bar
        var playprogbar = desktop_view.querySelector(".progbar_empty")
        var playprogbar_style = (playprogbar.currentStyle || window.getComputedStyle(playprogbar, null))

        var range = document.createElement("input")
        range.className = "BandcampVolume_range"

        var playprogbarthumb = desktop_view.querySelector(".thumb")
        var playprogbarthumb_style = (playprogbarthumb.currentStyle || window.getComputedStyle(playprogbarthumb, null))

        var css = "/*BandcampVolume CSS*/ .BandcampVolume_range::-webkit-slider-thumb"

        if(page == "user") {
            range.style.background = playprogbar_style.backgroundColor
            range.style.border = playprogbar_style.border
            css=css+"{background: " + playprogbarthumb_style.background + " !important; border: " + playprogbarthumb_style.border + " !important; border-color: " + playprogbarthumb_style.borderColor + " !important; height: 10px; width: 17px; border-radius: 2px;}"
        } else if (page == "home") {
            range.style.borderRadius = "3px"
            css=css+"{background: " + playprogbarthumb_style.background + " !important; border: none !important; height: 19px !important; width: 19px !important}"
        }
        style=document.createElement('style')
        if (style.styleSheet)
            style.styleSheet.cssText=css
        else 
            style.appendChild(document.createTextNode(css))
        document.getElementsByTagName('head')[0].appendChild(style)

        range.type="range"
        range.max = 1
        range.step = 0.01
        range.min = 0
        range.value = this._audiotag.volume
        range.addEventListener("input", this._slider_change.bind(this))
        range.addEventListener("change", this._slider_set.bind(this))
        this._volSpeaker.addEventListener("click", this._set_volume_evt.bind(this))       
        this._ranges.push(range)

        volcontainer.appendChild(this._volSpeaker)
        volcontainer.appendChild(range)

        if(page == "user") {
            col.appendChild(volcontainer)
            desktop_view.querySelector("tbody").appendChild(row)
        } else {
            innerContainer.appendChild(volcontainer)
            innerContainer.appendChild(volHover)
            outerContainer.appendChild(innerContainer)
            document.getElementsByClassName('home-bd')[0].appendChild(outerContainer)
        }

    }
}

BandcampVolume.load()




