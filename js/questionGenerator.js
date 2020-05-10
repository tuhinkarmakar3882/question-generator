window.onload = () => {
    $('#originalTextArea').text('The text property sets or returns the text of an option element.\n' +
        '\n' +
        'Tip: If the value property is not specified for an option element, then the text content will be sent to the server when the container form is submitted.')
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
    let textAreaElement = document.getElementById('originalTextArea');
    let selectionPositionIndex = getPositionOfSelectedContentIn(textAreaElement);
    textAreaElement.value = textAreaElement.value.substring(0, selectionPositionIndex['start']) + newContent + textAreaElement.value.substr(selectionPositionIndex['end']);
    renderToPuzzle()
}

function revertSelection() {
    let selectionObject = window.getSelection();
    let selectedText = selectionObject.toString();
    let newContent = selectedText;
    if (selectedText.trim() !== '') {
        newContent = selectedText.replace(/<<</g, '');
        newContent = newContent.replace(/>>>/g, '');
        updateTextAreaWith(newContent)
    }
}

function convertSelection() {
    let selectionObject = window.getSelection();
    let selectedText = selectionObject.toString();
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