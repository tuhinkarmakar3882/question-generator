let textAreaElement;

window.onload = () => {

    textAreaElement = document.getElementById('originalTextArea');
    textAreaElement.value = "The text property sets or returns the text of an option element.\n Tip: If the value property is not specified for an option element, then the text content will be sent to the server when the container form is submitted."
};

function renderToPuzzle() {
    function generateOptionsFrom(text) {
        let options = [];
        let segments = text.split('<<<');
        segments.forEach((segment) => {
            let endingSeqPosition = segment.search(/>>>/);

            if (endingSeqPosition !== -1) {
                // This Implies Match Exists
                options.push(segment.substr(0, endingSeqPosition));  // Discard the ending sequence
            }
        });
        return options;
    }

    function generateSelectionDropdown(text, options) {
        let htmlSelectElement = document.createElement('select');
        htmlSelectElement.classList = 'customDropdown'
        options.forEach((option) => {
            let newOption = document.createElement('option');
            newOption.value = option;
            newOption.innerText = option;
            htmlSelectElement.appendChild(newOption);
        });
        return htmlSelectElement;
    }

    function replaceWithDropdown(text, dropdown) {
        let renderedViewElement = document.getElementById('renderedView');
        renderedViewElement.innerHTML = ''; //  Initialize

        let newSpanElement = document.createElement('span');    //  Create a new Span with the Dropdown
        newSpanElement.appendChild(dropdown);
        let formattedText = text.replace(/\n/g, '<br>');
        let textSegments = formattedText.split('<<<');   //  Parse the text into different segments

        textSegments.forEach((segment) => {
            let endingSeqPosition = segment.search(/>>>/);

            if (endingSeqPosition !== -1) {
                // This Implies Match Exists
                renderedViewElement.innerHTML += ' ' + newSpanElement.innerHTML + ' ' + segment.substr(endingSeqPosition + 3); //  replace the places with newSpanElement
            } else {
                renderedViewElement.innerHTML += segment;  //  replace the places with newSpanElement
            }
        });
    }

    let textArea = document.getElementById('originalTextArea');
    let textAreaContent = textArea.value;
    let options = generateOptionsFrom(textAreaContent);
    let selectionDropdown = generateSelectionDropdown(textAreaContent, options)
    replaceWithDropdown(textAreaContent, selectionDropdown);
    textArea.value = textAreaContent;

}

function updateTextAreaWith(newContent) {
    let selectionPositionIndex = getPositionOfSelectedContentIn(textAreaElement);
    textAreaElement.value = textAreaElement.value.substring(0, selectionPositionIndex['start']) + newContent + textAreaElement.value.substr(selectionPositionIndex['end']);
    renderToPuzzle()
}

function revertSelection() {

    let selectedText = textAreaElement.value.substring(textAreaElement.selectionStart, textAreaElement.selectionEnd);
    let newContent = selectedText;
    if (selectedText.trim() !== '') {
        newContent = selectedText.replace(/<<</g, '');
        newContent = newContent.replace(/>>>/g, '');
        updateTextAreaWith(newContent)
    }
}

function convertSelection() {
    let selectedText = textAreaElement.value.substring(textAreaElement.selectionStart, textAreaElement.selectionEnd);
    let newContent = selectedText;

    if (selectedText.trim() !== '') {
        newContent = '<<<' + selectedText + '>>>';
        updateTextAreaWith(newContent)
    }
}

function getPositionOfSelectedContentIn(inputArea) {
    let start = inputArea.selectionStart;
    let end = inputArea.selectionEnd;
    return {
        start: start,
        end: end
    };
}

function exportToHTML() {
    let fileName = 'question_sheet.html';
    let targetElement = document.getElementById('renderedView').innerHTML;
    let link = document.createElement('a');
    let mimeType = 'text/plain';
    link.setAttribute('download', fileName);
    link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(targetElement));
    link.click();
}