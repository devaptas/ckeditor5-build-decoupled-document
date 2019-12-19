// Add eventos
import ViewPosition from "@ckeditor/ckeditor5-engine/src/view/position";
import ViewTreeWalker from "@ckeditor/ckeditor5-engine/src/view/treewalker";

export function addCustomEvents(editor) {

	// Utiliza F6 para avançar variaveis
	editor.keystrokes.set('F6', (data, stop) => {
		stop();
		data.preventDefault();
		data.stopPropagation();
		nextPlaceholder(editor)
	});
}

export function nextPlaceholder(editor){
	const ckDocument = editor.editing.view.document;
	const current = ckDocument.selection.getLastRange();
	const position = new ViewPosition(current.end.parent, 0);
	const walker = new ViewTreeWalker({
		startPosition: position,
		ignoreElementEnd: true,
	});
	for (let element of walker) {
		if (element.type === 'elementStart') {
			const item = element.item;
			if (item.hasClass('placeholder') && item.hasAttribute('data-is-fixed') && !item.getAttribute('data-is-fixed')) {
				const modelElement = editor.editing.mapper.toModelElement(item);
				editor.model.change(writer => {
					writer.setSelection(modelElement, 'in');
				});
				const domConverter = editor.editing.view.domConverter;
				domConverter.viewToDom(item, ckDocument).click();
				return true;
			}
		}
	}
	return false;
}

/**
 * @return {boolean}
 */
export function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

