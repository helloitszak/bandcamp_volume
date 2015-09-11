var BandcampVolume = 
{
    _ranges:[],
    _audiotags:[],
    _volSpeaker:null,
    _lastVol:null,
    _slider_lastVol:null,
    _slider_change:function(evt)
    {
        var vol = parseFloat(evt.target.value)
        // Set the audio tag's volume to the slider's volume
        for(i = 0;i < this._audiotags.length; i++) {
            this._audiotags[i].volume = vol
        }

        this._volSpeaker_set(vol)
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

        this._lastVol = this._audiotags[0].volume

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
            var newvol = items["volume"] || bcv._audiotags[0].volume

            bcv._ranges.forEach(function(element, index, array)
            {
                element.value = newvol
            })
            bcv._audiotags.forEach(function(element, index, array) {
                bcv._audiotags[index].volume = newvol
            })
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
    _containerResize:function()
    {
        if(this._this_page() == "home") {
            var wrapper = document.getElementsByClassName('home-bd')[0]
        } else {
            var wrapper = document.getElementById('centerWrapper')
        }

        var wrapper_style = (wrapper.currentStyle || window.getComputedStyle(wrapper, null)),
        outerContainer = document.getElementsByClassName('BandcampVolume_outer_container')[0]
        outerContainer.style.width = wrapper_style.width
    },
    load:function()
    {
        var page = this._this_page()

        this._audiotags = Array.prototype.slice.call(document.getElementsByTagName("audio"))

        var volcontainer = document.createElement("div")
        this._volSpeaker = document.createElement("button")
        this._volSpeaker.type = "button"
        var range = document.createElement("input")
        range.className = "BandcampVolume_range"
        this._auto_set(this)

        if(page == "user") {
            volcontainer.className = "BandcampVolume_user_container"   

            var desktop_view = document.getElementsByClassName("inline_player")[0]            
            // Create the volume layout
            desktop_view.querySelector("tr:first-child td:first-child").setAttribute("rowspan", "3")

            var row = document.createElement("tr"),
            col = row.appendChild(document.createElement("td"))
            col.setAttribute("colspan", "3")

            // Get some stuff from the player progress bar to add style to the volume bar
            var playprogbar = desktop_view.querySelector(".progbar_empty"),
            playprogbar_style = (playprogbar.currentStyle || window.getComputedStyle(playprogbar, null)),
            playprogbarthumb = desktop_view.querySelector(".thumb"),
            playprogbarthumb_style = (playprogbarthumb.currentStyle || window.getComputedStyle(playprogbarthumb, null)),
            css = "/*BandcampVolume CSS*/ .BandcampVolume_range {background: " + playprogbar_style.backgroundColor + "; border: " + playprogbar_style.border + "} .BandcampVolume_range::-webkit-slider-thumb {background: " + playprogbarthumb_style.background + " !important; border: " + playprogbarthumb_style.border + " !important; border-color: " + playprogbarthumb_style.borderColor + " !important; height: 10px; width: 17px; border-radius: 2px;}"
            
            style=document.createElement('style')
            if (style.styleSheet)
                style.styleSheet.cssText=css
            else 
                style.appendChild(document.createTextNode(css))
            document.getElementsByTagName('head')[0].appendChild(style)
        } else {
            range.className = range.className + " BandcampVolume_range_home"

            volcontainer.className = "BandcampVolume_container"
            if(page == "home") {
                var wrapper = document.getElementsByClassName('home-bd')[0]
            } else {
                var wrapper = document.getElementById('centerWrapper')
            }
            var wrapper_style = (wrapper.currentStyle || window.getComputedStyle(wrapper, null)),
            outerContainer = document.createElement("div")
            outerContainer.className = "BandcampVolume_outer_container"
            outerContainer.style.width = wrapper_style.width

            var innerContainer = document.createElement("div")
            innerContainer.className = "BandcampVolume_inner_container"

            var volHover = document.createElement("div")
            volHover.className = "BandcampVolume_hoverBox"
            volHover.className = volHover.className + " icon-volume"
        }

        range.type="range"
        range.max = 1
        range.step = 0.01
        range.min = 0
        range.value = this._audiotags[0].volume
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
            wrapper.appendChild(outerContainer)

            var bcv = this
            window.addEventListener('resize', function(event){bcv._containerResize()})      
        }

    }
}

BandcampVolume.load()




