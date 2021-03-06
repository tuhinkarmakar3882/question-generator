let textAreaElement;

window.onload = () => {
    textAreaElement = document.getElementById("originalTextArea");
    textAreaElement.value =
        "Anything within <<<THIS BRACKETS>>> will be replaced by a DropDown!\n\n" +
        "To get started, Delete this Placeholder Text & Type your content.\n\n" +
        "Once you're done, select the content that you want to convert & Click on convert Selection.\n\n" +
        "To Revert: Select the entire region & Click on Revert Selection";
    renderToPuzzle();
};

function generateOptionsFrom(text) {
    let options = [];
    let segments = text.split("<<<");
    segments.forEach((segment) => {
        let endingSeqPosition = segment.search(/>>>/);

        if (endingSeqPosition !== -1) {
            // This Implies Match Exists
            //replace single and double quotes with a space while generating the options
            options.push(
                segment
                    .substr(0, endingSeqPosition)
                    .replace(/(\r\n|\n|\r)/gm, "")
                    .replace(/[']|["]/g, " ")
            );
        }
    });
    return options;
}

function generateSelectionDropdown(text, options) {
    let htmlSelectElement = document.createElement("select");
    htmlSelectElement.classList.add("customDropdown");

    //  Create a Default Option for that DropDown
    let defaultOption = document.createElement("option");
    defaultOption.value = "Select an Option";
    defaultOption.innerText = "Select an Option";
    defaultOption.setAttribute("disabled", "");
    defaultOption.setAttribute("selected", "");
    htmlSelectElement.appendChild(defaultOption);

    //  Append the rest of the options

    let shuffledOptions = shuffleArray(options);

    shuffledOptions.forEach((option) => {
        let newOption = document.createElement("option");
        newOption.value = option;
        newOption.innerText = option;
        htmlSelectElement.appendChild(newOption);
    });
    return htmlSelectElement;
}

function replaceWithDropdown(text, dropdown) {
    let renderedViewElement = document.getElementById("renderedView");
    renderedViewElement.innerHTML = ""; //  Initialize

    let newSpanElement = document.createElement("span"); //  Create a new Span with the Dropdown
    newSpanElement.appendChild(dropdown);

    let formattedText = text.replace(/\n/g, "<br>");
    let textSegments = formattedText.split("<<<"); //  Parse the text into different segments

    textSegments.forEach((segment) => {
        let endingSeqPosition = segment.search(/>>>/);

        if (endingSeqPosition !== -1) {
            // This Implies Match Exists
            renderedViewElement.innerHTML +=
                " " +
                newSpanElement.innerHTML +
                " " +
                segment.substr(endingSeqPosition + 3); //  replace the places with newSpanElement
        } else {
            renderedViewElement.innerHTML += segment; //  replace the places with newSpanElement
        }
    });
}

function renderToPuzzle() {
    let textArea = document.getElementById("originalTextArea");
    let textAreaContent = textArea.value;
    let options = generateOptionsFrom(textAreaContent);
    let selectionDropdown = generateSelectionDropdown(textAreaContent, options);
    replaceWithDropdown(textAreaContent, selectionDropdown);
}

function updateTextAreaWith(newContent) {
    let selectionPositionIndex = getPositionOfSelectedContentIn(textAreaElement);
    textAreaElement.value =
        textAreaElement.value.substring(0, selectionPositionIndex["start"]) +
        newContent +
        textAreaElement.value.substr(selectionPositionIndex["end"]);
    renderToPuzzle();
}

function revertSelection() {
    let selectedText = textAreaElement.value.substring(
        textAreaElement.selectionStart,
        textAreaElement.selectionEnd
    );

    if (selectedText.trim() !== "") {
        selectedText = selectedText.replace(/<<</g, "");
        selectedText = selectedText.replace(/>>>/g, "");
        updateTextAreaWith(selectedText);
    }
}

function convertSelection() {
    let selectedText = textAreaElement.value.substring(
        textAreaElement.selectionStart,
        textAreaElement.selectionEnd
    );

    if (selectedText.trim() !== "") {
        selectedText = "<<<" + selectedText + ">>>";
        updateTextAreaWith(selectedText);
    }
}

function getPositionOfSelectedContentIn(inputArea) {
    let start = inputArea.selectionStart;
    let end = inputArea.selectionEnd;
    return {
        start: start,
        end: end,
    };
}

function shuffleArray(array) {
    let length = array.length, temp, newIndex;

    // While there remain elements to shuffle…
    while (length) {

        // Pick a remaining element…
        newIndex = Math.floor(Math.random() * length--);

        // And swap it with the current element.
        temp = array[length];
        array[length] = array[newIndex];
        array[newIndex] = temp;
    }

    return array;
}

function exportToHTML() {
    let fileName = "question_sheet.html";

    let expectedOptions = generateOptionsFrom(textAreaElement.value);

    let downloadableContent =
        `
        <div class="information">
            <input type="text" placeholder="Enter Your Name" id="username"/>
        </div>
        <div id='responseText'> 
            ${document.getElementById("renderedView").innerHTML}
         </div>`;

    downloadableContent += document.querySelector('.externalLibraries').innerHTML;

    let injectableJS = document.querySelector('#injectableJS');

    downloadableContent +=
        `<script defer> 
            let expectedOptions = '${expectedOptions}';
            ${injectableJS.innerHTML} 
        </script>`;

    downloadableContent +=
        `<div>
        
            <button class="customButton" id="evaluate"> Evaluate </button>
        </div>`;

    downloadableContent +=
        `<div> 
            <h3 class='scoreArea'></h3>
        </div>`;


    // Append the CSS
    let injectableCSS = document.getElementById('injectableCSS');

    downloadableContent +=
        `<style>
            ${injectableCSS.innerHTML}
        </style>`;


    //  Generate a link and Download
    let link = document.createElement("a");
    let mimeType = "text/plain";
    link.setAttribute("download", fileName);
    link.setAttribute(
        "href",
        "data:" + mimeType + ";charset=utf-8," + encodeURIComponent(downloadableContent)
    );
    link.click();
}
