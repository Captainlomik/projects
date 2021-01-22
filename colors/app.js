//Global variables 
const colorDivs = document.querySelectorAll('.color')
const sliders = document.querySelectorAll('input[type="range"]')
const currentHexes = document.querySelectorAll('.color h2')
const generateBtn = document.querySelector('.generate')
const controlsBtn = document.querySelectorAll('.controls')
const popupCopy = document.querySelector('.copy-container')
const adjustButton = document.querySelectorAll('.adjust')
const lockButton = document.querySelectorAll('.lock')
const closeAdjustnents = document.querySelectorAll('.close-adjustment')
const sliderContainers = document.querySelectorAll('.sliders')
let initialColors;


//event listeners
sliders.forEach(slider => {
    slider.addEventListener("input", hslControls)
})

colorDivs.forEach((div, index) => {
    div.addEventListener('change', () => {
        updateText(index)
    })
})

generateBtn.addEventListener('click', randomColors)

currentHexes.forEach(txt => {
    txt.addEventListener('click', () => {
        window.navigator.clipboard.writeText(txt.innerText) //add txt to buffer
        const popupBox = popupCopy.children[0]
        popupCopy.classList.add('active')
        popupBox.classList.add('active')

    })
});

popupCopy.addEventListener('transitionend', () => {
    const popupBox = popupCopy.children[0]
    popupCopy.classList.remove('active')
    popupBox.classList.remove('active')

})

adjustButton.forEach((button, index) => {
    button.addEventListener('click', () => {
        openAdjastmentPanel(index)
    })
})

closeAdjustnents.forEach((button, index) => {
    button.addEventListener('click', () => {
        closeAdjustmentPanel(index)
    })
})

lockButton.forEach((button) => {
    button.addEventListener('click', () => {
        if (button.classList.toggle('locked')) {
            button.innerHTML = '<i class="fas fa-lock">'
        } else {
            button.innerHTML = '<i class="fas fa-lock-open">'
        }
    })
})
//Function
function generateHexColor() {
    /* const letters = "0123456789ABCDEF"
     let color = "#"
     for (let i = 0; i < 6; i++) {
         color += letters[Math.floor(Math.random() * 16)]
     }
     return color;*/

    const color = chroma.random()
    return color;
}


function randomColors() {

    initialColors = []
    colorDivs.forEach((div, index) => {
        const colorTxt = div.children[0]
        let randomColor = generateHexColor()

        if (lockButton[index].classList.contains('locked')) {
            initialColors.push(colorTxt.innerText)
            return
        } else {
            initialColors.push(chroma(randomColor).hex())
        }


        div.style.backgroundColor = randomColor;
        colorTxt.innerText = randomColor
        checkTxtColors(randomColor, colorTxt)
        checkTxtColors(randomColor, controlsBtn[index].children[1]) //NEED FIX
        checkTxtColors(randomColor, controlsBtn[index].children[0])


        const color = chroma(randomColor)
        const sliders = div.querySelectorAll('.sliders input')
        const hue = sliders[0]
        const brightness = sliders[1]
        const saturation = sliders[2]

        colorizeSliders(color, hue, brightness, saturation);
    })

    resetInputs()
}

function checkTxtColors(color, txt) {
    let luminance = chroma(color).luminance();
    if (luminance > 0.5)
        txt.style.color = "black"
    else
        txt.style.color = "white"
}


function colorizeSliders(color, hue, brightness, saturation) {
    //scale saturation 
    const noSat = color.set('hsl.s', 0)
    const fullSat = color.set('hsl.s', 1)
    const scaleSat = chroma.scale([noSat, color, fullSat])

    const midBright = color.set('hsl.l', 0.5)
    const scaleBright = chroma.scale(['black', midBright, 'white'])

    //update input colors
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(0.5)}, ${scaleBright(1)})`
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204, 75, 75), rgb(204, 204, 75), rgb(75, 204, 75), rgb(75, 204, 204), rgb(75, 75, 204), rgb(204, 75, 204), rgb(204, 75, 75))`
}

function hslControls(e) {
    const index = e.target.getAttribute('data-bright') ||
        e.target.getAttribute('data-saturation') ||
        e.target.getAttribute('data-hue') //find index of color


    let sliders = e.target.parentElement.querySelectorAll('input[type=range]')

    const hue = sliders[0]
    const brightness = sliders[1]
    const saturation = sliders[2]

    const bgColor = initialColors[index]

    let color = chroma(bgColor)
        .set('hsl.s', saturation.value)
        .set('hsl.l', brightness.value)
        .set('hsl.h', hue.value)

    colorDivs[index].style.backgroundColor = color

    //colorize inputs 
    colorizeSliders(color, hue, brightness, saturation)
}

function updateText(index) {
    const activeDive = colorDivs[index]
    const color = chroma(activeDive.style.backgroundColor)
    const textHex = activeDive.querySelector('h2')
    const icons = activeDive.querySelectorAll('.controls button')
    textHex.innerText = color.hex()

    checkTxtColors(color, textHex)
    for (let icon of icons) {
        checkTxtColors(color, icon)
    }
}

function resetInputs() {

    const sliders = document.querySelectorAll('.sliders input')
    sliders.forEach(slider => {
        if (slider.name === 'hue') {
            const hueColor = initialColors[slider.getAttribute('data-hue')]
            const hueValue = chroma(hueColor).hsl()[0]
            slider.value = Math.floor(hueValue)
        }

        if (slider.name === 'brightness') {
            const brightColor = initialColors[slider.getAttribute('data-bright')]
            const brightValue = chroma(brightColor).hsl()[2]
            slider.value = brightValue.toFixed(3)
        }

        if (slider.name === 'saturation') {
            const satColor = initialColors[slider.getAttribute('data-saturation')]
            const satValue = chroma(satColor).hsl()[1]
            slider.value = satValue.toFixed(3)
        }
    })
}

function openAdjastmentPanel(index) {
    sliderContainers[index].classList.toggle('active')
}

function closeAdjustmentPanel(index) {
    sliderContainers[index].classList.remove('active')
}

//Save

const saveBtn = document.querySelector(".save")
const submit = document.querySelector('.submit-save')

const closeSave = document.querySelector('.close-save')
const saveContainer = document.querySelector('.save-container')
const saveInput = document.querySelector('.save-container input')

const libraryContainer = document.querySelector('.library-container')
const libraryBtn = document.querySelector('.library')
const closeLibraryBtn = document.querySelector('.close-library')

saveBtn.addEventListener('click', openPalette)
closeSave.addEventListener('click', closePalette)
submit.addEventListener('click', savePalette)
libraryBtn.addEventListener('click', openLibrary)
closeLibraryBtn.addEventListener('click', closeLibrary)


function openPalette(e) {
    const popup = saveContainer.children[0]
    saveContainer.classList.add('active')
    popup.classList.add('active')
}

function closePalette(e) {
    const popup = saveContainer.children[0]
    saveContainer.classList.remove('active')
    popup.classList.add('remove')
}

function savePalette(e) {
    let savedPalettes = []
    saveContainer.classList.remove('active')
    const name = saveInput.value
    const colors = []
    currentHexes.forEach(hex => {
        colors.push(hex.innerText)
    })


    let paletteNr;
    const paletteObjects=JSON.parse(localStorage.getItem('palettes'))
    if(paletteObjects){
        paletteNr=paletteObjects.length;
    }
    else {
        paletteNr=savedPalettes.length
    }

    let paletteObj = {
        name,
        colors,
        paletteNr
    }
    savedPalettes.push(paletteObj)
    saveLocal(paletteObj)
    saveInput.value = ''
    //localStorage.set(paletteObj)

     const palette = document.createElement('div')
    palette.classList.add('custom-palette')
    const title = document.createElement('h4')
    title.innerText = paletteObj.name
    const preview = document.createElement('div')
    preview.classList.add('small-preview')
    paletteObj.colors.forEach(smallColor => {
        const smallDiv = document.createElement('div')
        smallDiv.style.backgroundColor = smallColor
        preview.appendChild(smallDiv)
    })

    const paletteBtn = document.createElement('button')
    paletteBtn.classList.add('pick-palette-btn')
    paletteBtn.classList.add(paletteObj.paletteNr)
    paletteBtn.innerText = "Select"


    //event to the btn 
  paletteBtn.addEventListener('click', e => {
        //closeLibrary();
        const paletteIndex = e.target.classList[1]
        initialColors = [];
        savedPalettes[paletteIndex].colors.forEach((color, index) => {
            initialColors.push(color)
            colorDivs[index].style.backgroundColor = color
            const text = colorDivs[index].children[0]
            checkTxtColors(color, text)
            updateText(paletteIndex)
        })
        resetInputs()
    })

    //append library
    palette.appendChild(title)
    palette.appendChild(preview)
    palette.appendChild(paletteBtn)
    libraryContainer.children[0].appendChild(palette)

}

function saveLocal(paletteObj) {
    let savedPalettes;
    if (localStorage.getItem('palettes') === null) {
        savedPalettes = []
    } else {
        savedPalettes = JSON.parse(localStorage.getItem('palettes'))
    }
    savedPalettes.push(paletteObj)
    localStorage.setItem('palettes', JSON.stringify(savedPalettes))
}

function openLibrary() {
    const popup = libraryContainer.children[0]
    libraryContainer.classList.add('active')
    popup.classList.add("active")
}

function closeLibrary() {
    const popup = libraryContainer.children[0]
    libraryContainer.classList.remove('active')
    popup.classList.remove("active")
}

function getLocal() {
    if (localStorage.getItem('palettes') === null) {
        savedPalettes = []
    } else {
        const paletteObject = JSON.parse(localStorage.getItem('palettes'))
        savedPalettes=[...paletteObject]
        paletteObject.forEach(paletteObj => {
            const palette = document.createElement('div')
            palette.classList.add('custom-palette')
            const title = document.createElement('h4')
            title.innerText = paletteObj.name
            const preview = document.createElement('div')
            preview.classList.add('small-preview')
            paletteObj.colors.forEach(smallColor => {
                const smallDiv = document.createElement('div')
                smallDiv.style.backgroundColor = smallColor
                preview.appendChild(smallDiv)
            })
        
            const paletteBtn = document.createElement('button')
            paletteBtn.classList.add('pick-palette-btn')
            paletteBtn.classList.add(paletteObj.paletteNr)
            paletteBtn.innerText = "Select"
        
        
            //event to the btn 
            paletteBtn.addEventListener('click', e => {
                closeLibrary();
                const paletteIndex = e.target.classList[1]
                initialColors = [];
                savedPalettes[paletteIndex].colors.forEach((color, index) => {
                    initialColors.push(color)
                    colorDivs[index].style.backgroundColor = color
                    const text = colorDivs[index].children[0]
                    checkTxtColors(color, text)
                    updateText(paletteIndex)
                })
                resetInputs()
            })
        
            //append library
            palette.appendChild(title)
            palette.appendChild(preview)
            palette.appendChild(paletteBtn)
            libraryContainer.children[0].appendChild(palette)
        })
    }
}

getLocal()
randomColors()
