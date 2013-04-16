var BandcampVolume = 
{
	_ranges:[],
	_audiotag:null,
	_slider_change:function(evt)
	{
		// Set the audio tag's volume to the slider's volume
		this._audiotag.volume = evt.target.value
	},
	_slider_mouseup:function(evt)
	{
		// Get the value of the input
		var newvol = evt.target.value

		// Put it in Chrome's local storage for global persistance
		chrome.storage.local.set({"volume":newvol})

		// Yes I know I am going to set the slider that's triggering this event to it's own value.
		this._ranges.forEach(function(element, index, array)
		{
			element.value = newvol
		});
	},
	load:function()
	{
		this._audiotag = document.getElementsByTagName("audio")[0]

		// Rebind this for use in the callback
		var bcv = this
		chrome.storage.local.get("volume", function(items) {
			var newvol = items["volume"]

			bcv._ranges.forEach(function(element, index, array)
			{
				element.value = newvol
			});
			bcv._audiotag.volume = newvol
		});

		// Create the volume layout
		var desktop_view = document.getElementsByClassName("inline_player desktop-view")[0]
		var audiotag = document.getElementsByTagName("audio")[0] 
		desktop_view.querySelector("tr:first-child td:first-child").setAttribute("rowspan", "3")

		var row = document.createElement("tr")
		var col = row.appendChild(document.createElement("td"))
		col.setAttribute("colspan", "3")

		var volcontainer = document.createElement("div")
		volcontainer.style.marginLeft = "0.3em"

		var input = document.createElement("span")
		input.innerText = "Volume:"
		input.style.marginRight = "0.3em"
		input.style.fontWeight = "bold"
		input.style.display = "inline-block"
		input.style.verticalAlign = "middle"
		input.style.height = "14px"


		// Get some stuff from the player progress bar to add style to the volume bar
		var playprogbar = desktop_view.querySelector(".progbar_empty")
		var playprogbar_style = (playprogbar.currentStyle || window.getComputedStyle(playprogbar, null))

		var range = document.createElement("input")
		range.style.display = "inline-block"
		range.style.verticalAlign = "middle"

		range.style.height = "4px"
		range.style.webkitAppearance = "none"
		range.style.background = "none"
		range.style.border = playprogbar_style.border

		range.type="range"
		range.max = 1
		range.step = 0.01
		range.min = 0
		range.value = this._audiotag.volume
		range.addEventListener("change", this._slider_change.bind(this))
		range.addEventListener("mouseup", this._slider_mouseup.bind(this))
		this._ranges.push(range)

		volcontainer.appendChild(input)
		volcontainer.appendChild(range)
		col.appendChild(volcontainer)
		desktop_view.querySelector("tbody").appendChild(row)
	}
}

BandcampVolume.load()







