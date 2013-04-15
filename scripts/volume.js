var player = document.getElementsByClassName("inline_player desktop-view")[0]
if (player)
{
	var audiotag = document.getElementsByTagName("audio")[0] 
	player.querySelector("tr:first-child td:first-child").setAttribute("rowspan", "3")

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
	var playprogbar = player.querySelector(".progbar_empty")
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
	range.value = audiotag.volume
	range.addEventListener("change", function(evt) {
		audiotag.volume = evt.target.value 
	});

	volcontainer.appendChild(input)
	volcontainer.appendChild(range)
	col.appendChild(volcontainer)
	player.querySelector("tbody").appendChild(row)
}


