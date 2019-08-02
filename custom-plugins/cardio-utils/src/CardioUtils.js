import ModelPosition from '@ckeditor/ckeditor5-engine/src/model/position';
import ModelTreeWalker from '@ckeditor/ckeditor5-engine/src/model/treewalker';
import {keyCodes} from '@ckeditor/ckeditor5-utils/src/keyboard';
import ViewPosition from '@ckeditor/ckeditor5-engine/src/view/position';
import ViewTreeWalker from '@ckeditor/ckeditor5-engine/src/view/treewalker';

/**
 * @param editor CKEditor instance
 * @param value string to set
 * @param item @ckeditor/ckeditor5-engine/src/model/item
 */
function setCkElement(editor, item, value) {
	if ( item ) {
		editor.model.change(writer => {
			if ( item._children._nodes[0] && item._children._nodes[0]._data === value ) {
				return;
			}
			item._children._nodes.forEach(function(child) {
				writer.remove(child);
			});
			writer.insertText(value, item);
		});
	}
}

/**
 * @param editor CKEditor instance
 * @param id string of element to set
 * @param value string to set
 * @returns {*}
 */
function setCkElementById(editor, id, value) {
	const position = new ModelPosition(editor.model.document.getRoot(), [0]);
	const walker = new ModelTreeWalker({startPosition: position});
	let item = undefined;
	for (let element of walker) {
		if ( element.type !== 'text' && element.item._attrs.get('id') === id ) {
			item = element.item;
			break;
		}
	}
	setCkElement(editor, item, value);
}

/**
 * @param editor CKEditor instance
 * @param className string class of element to set
 * @param value string to set
 * @returns {*}
 */
function setCkElementByClass(editor, className, value) {
	const position = new ModelPosition(editor.model.document.getRoot(), [0]);
	const walker = new ModelTreeWalker({startPosition: position});
	for (let element of walker) {
		if (
			element.type !== 'text' &&
			element.item._attrs.get('classes') &&
			inArray(className, element.item._attrs.get('classes'))
		) {
			setCkElement(editor, element.item, value);
		}
	}
}

export function makeStressCalculations(editor, editableElement) {

	const cellClasses = Array.from(editableElement._classes.values());

	setTimeout(function() {
		if ( editableElement._children[0] ) {
			setCkElementByClass(editor, cellClasses[1], editableElement._children[0]._textData);
		}

		let sum = 0;
		const sectionCells = document.querySelectorAll(`.${cellClasses[0]}`);
		sectionCells.forEach((cell) => {
			sum = sum + parseInt(cell.textContent);
		});

		const cellsAvg = sum / sectionCells.length;
		const cellsAvgFormatted = cellsAvg.toFixed(2).toString().replace('.', ',');

		let result = '';
		if ( cellsAvg === 1 ) {
			result = `${cellsAvgFormatted} (Valor normal)`;
		} else if ( cellsAvg > 1 && cellsAvg <= 1.6 ) {
			result = `${cellsAvgFormatted} (Disfunção discreta)`;
		} else if ( cellsAvg > 1.6 && cellsAvg <= 2 ) {
			result = `${cellsAvgFormatted} (Disfunção moderada)`;
		} else if ( cellsAvg > 2 ) {
			result = `${cellsAvgFormatted} (Disfunção importante)`;
		}

		const elemID = cellClasses[0].split('-').pop();
		setCkElementById(editor, elemID, result);
	}, 50);
}

// Efetua os cálculos de acordo com o elemento que foi alterado nos widgets Ecocardio e Ecocardio Complementar
export function makeCalculations(elementId, editor) {

	let values = [];
	let result = 0;

	// Superfície Corporal (m²)
	if ( elementId === 'altura' || elementId === 'peso' ) {
		values = getFormattedValues('altura', 'peso');
		let result;
		if ( checkNumeric(values) ) {
			result = truncate(0.007184 * (Math.pow(values[0], 0.725)) * (Math.pow(values[1], 0.425)), 2).toString();
		} else {
			result = '-';
		}
		setCkElementById(editor, 'sc', result);
		if ( !isNaN(result) ) {
			makeCalculations('sc', editor);
		}
	}

	// Volume do AE / Superfície Corporal
	if ( elementId === 'vae' || elementId === 'cae' || elementId === 'sc' ) {
		values = getFormattedValues('vae', 'sc');
		let result;
		if ( checkNumeric(values) ) {
			result = truncate(values[0] / values[1], 1).toString();
		} else {
			result = '-';
		}
		setCkElementById(editor, 'vaesc', result);
	}

	// Volume Diastólico Final
	if ( elementId === 'ddfve' ) {
		values = getFormattedValues('ddfve');
		let result;
		if ( checkNumeric(values) ) {
			result = truncate(((7 * values[0] * values[0] * values[0]) / (2.4 + (values[0] / 10))) / 1000, 1).toString();
		} else {
			result = '-';
		}
		setCkElementById(editor, 'vdf', result);
	}

	// Volume Sistólico Final
	if ( elementId === 'dsfve' ) {
		values = getFormattedValues('dsfve');
		let result;
		if ( checkNumeric(values) ) {
			result = truncate(((7 * values[0] * values[0] * values[0]) / (2.4 + (values[0] / 10))) / 1000, 1).toString();
		} else {
			result = '-';
		}
		setCkElementById(editor, 'vsf', result);
	}

	// Volume Diastólico Final / Superficie Corporal
	if ( elementId === 'ddfve' || elementId === 'sc' ) {
		values = getFormattedValues('ddfve', 'sc');
		let result;
		if ( checkNumeric(values) ) {
			result = truncate((((7 * values[0] * values[0] * values[0]) / (2.4 + (values[0] / 10))) / 1000) / values[1], 1).toString();
		} else {
			result = '-';
		}
		setCkElementById(editor, 'vdfsc', result);
	}

	// Volume Diastólico Final / Superficie Corporal (caso seja alterado o campo Volume Diastólico Final)
	if ( elementId === 'vdf' ) {
		values = getFormattedValues('vdf', 'sc');
		let result;
		if ( checkNumeric(values) ) {
			result = truncate(values[0] / values[1], 1).toString();
		} else {
			result = '-';
		}
		setCkElementById(editor, 'vdfsc', result);
	}

	// Volume Sistólico Final / Superfície Corporal
	if ( elementId === 'dsfve' || elementId === 'sc' || elementId === 'vsf' ) {
		values = getFormattedValues('dsfve', 'sc');
		let result;
		if ( checkNumeric(values) ) {
			result = truncate((((7 * values[0] * values[0] * values[0]) / (2.4 + (values[0] / 10))) / 1000) / values[1], 1).toString();
		} else {
			result = '-';
		}
		setCkElementById(editor, 'vdfsc', result);
	}

	// Volume Sistólico Final / Superficie Corporal (caso seja alterado o campo Volume Sistólico Final)
	if ( elementId === 'vsf' ) {
		values = getFormattedValues('vsf', 'sc');
		let result;
		if ( checkNumeric(values) ) {
			result = truncate(values[0] / values[1], 1).toString();
		} else {
			result = '-';
		}
		setCkElementById(editor, 'vdfsc', result);
	}

	// Diâmetro Diastólico Final do VE / SC
	if ( elementId === 'ddfve' || elementId === 'sc' ) {
		values = getFormattedValues('ddfve', 'sc');
		let result;
		if ( checkNumeric(values) ) {
			result = truncate(values[0] / values[1], 1).toString();
		} else {
			result = '-';
		}
		setCkElementById(editor, 'ddfvesc', result);
	}

	// Diâmetro Sistólico Final do VE / SC
	if ( elementId === 'dsfve' || elementId === 'sc' ) {
		values = getFormattedValues('dsfve', 'sc');
		let result;
		if ( checkNumeric(values) ) {
			result = truncate(values[0] / values[1], 1).toString();
		} else {
			result = '-';
		}
		setCkElementById(editor, 'dsfvesc', result);
	}

	// Fração de Ejeção (Teicholz)
	if ( elementId === 'ddfve' || elementId === 'dsfve' ) {
		values = getFormattedValues('ddfve', 'dsfve');
		let result;
		if ( checkNumeric(values) ) {
			result = ((Math.pow(values[0], 2) - Math.pow(values[1], 2)) / Math.pow(values[0], 2));
			result = 100.0 * (result + (1 - result) * 0.15);
			result = Math.round(result);
			result = truncate(result, 1).toString();
		} else {
			result = '-';
		}
		setCkElementById(editor, 'fet', result);
	}

	// Pecentual Encurtamento Cavidade
	if ( elementId === 'vsf' || elementId === 'dsfve' || elementId === 'ddfve' || elementId === 'vdf' ) {
		values = getFormattedValues('ddfve', 'dsfve');
		let result;
		if ( checkNumeric(values) ) {
			result = truncate((values[0] - values[1]) * (100 / values[0]), 1).toString();
		} else {
			result = '-';
		}
		setCkElementById(editor, 'pec', result);
	}

	// Massa do VE/superficie Corporal
	if ( elementId === 'eds' || elementId === 'edppve' || elementId === 'sc' || elementId === 'ddfve' ) {
		values = getFormattedValues('eds', 'edppve', 'ddfve', 'sc');
		let result;
		if ( checkNumeric(values) ) {
			let temp = values[0] + values[1] + values[2];
			result = truncate(
				((0.8 * (1.04 * (Math.pow(temp, 3) - Math.pow(values[2], 3)) + 0.6)) / values[3]) / 1000, 1,
			).toString();
		} else {
			result = '-';
		}
		setCkElementById(editor, 'mvesc', result);
	}

	// Massa Ventricular Esquerda
	if ( elementId === 'edppve' || elementId === 'vsf' || elementId === 'ddfve' ) {
		values = getFormattedValues('eds', 'edppve', 'ddfve');
		let result;
		if ( checkNumeric(values) ) {
			result = truncate((
				(0.8 * (1.04 * (Math.pow(values[0] + values[1] + values[2], 3) - Math.pow(values[2], 3)) + 0.6))) / 1000, 1,
			).toString();
		} else {
			result = '-';
		}
		setCkElementById(editor, 'mve', result);
	}

	// Espessura Relativa das Paredes do VE
	if ( elementId === 'edppve' || elementId === 'ddfve' ) {
		values = getFormattedValues('edppve', 'ddfve');
		let result;
		if ( checkNumeric(values) ) {
			result = truncate((2 * values[0]) / values[1], 2).toString();
		} else {
			result = '-';
		}
		setCkElementById(editor, 'erpve', result);
		if ( !isNaN(result) ) {
			makeCalculations('erpve', editor);
		}
	}

	// Relação ERP e Massa VE i
	if ( elementId === 'erpve' || elementId === 'mvesc' || elementId === 'eds' ) {
		let patientGender = editor.config.get('patientGender');
		values = getFormattedValues('erpve', 'mvesc');
		let result;
		if ( checkNumeric(values) ) {
			if ( patientGender === 'M' ) {
				if ( values[1] <= 115 ) {
					if ( values[0] <= 0.42 ) {
						result = 'Geometria normal';
					} else if ( values[0] > 0.42 ) {
						result = 'Remodelamento Concêntrico';
					}
				} else {
					if ( values[0] <= 0.42 ) {
						result = 'Hipertrofia Excêntrica';
					} else if ( values[0] > 0.42 ) {
						result = 'Hipertrofia Concêntrica';
					}
				}
			} else {
				if ( values[1] <= 95 ) {
					if ( values[0] <= 0.42 ) {
						result = 'Geometria normal';
					} else if ( values[0] > 0.42 ) {
						result = 'Remodelamento Concêntrico';
					}
				} else {
					if ( values[0] <= 0.42 ) {
						result = 'Hipertrofia Excêntrica';
					} else if ( values[0] > 0.42 ) {
						result = 'Hipertrofia Concêntrica';
					}
				}
			}
		} else {
			result = '-';
		}
		setCkElementById(editor, 'rerp', result);
	}

	// Relação E / A
	if ( elementId === 'fmoe' || elementId === 'fmoa' ) {
		values = getFormattedValues('fmoe', 'fmoa');
		let result;
		if ( checkNumeric(values) ) {
			result = truncate(values[0] / values[1], 1).toString();
		} else {
			result = '-';
		}
		setCkElementById(editor, 'rea', result);
	}

	// Média Rel E / e'
	if ( elementId === 'fmoe' || elementId === 'es' || elementId === 'el' ) {
		values = getFormattedValues('fmoe', 'es', 'el');
		let result;
		if ( checkNumeric(values) ) {
			result = truncate(values[0] / ((values[1] + values[2]) / 2), 1).toString();
		} else {
			result = '-';
		}
		setCkElementById(editor, 'mree', result);
	}

	// letiação da Veia Cava Inferior
	if ( elementId === 'vci' || elementId === 'vcie' ) {
		values = getFormattedValues('vci', 'vcie');
		let result;
		if ( checkNumeric(values) ) {
			result = (values[0] - values[1]) / values[1];

			//Caso a divisão seja por 0, o resultado tende a infinito, então esse caso é tratado manualmente.
			if ( result > 100 )
				result = 100;
			result = truncate(result, 1).toString();
		} else {
			result = '-';
		}
		setCkElementById(editor, 'vvci', result);
	}
}

// Transforma o valor de determinado campo do CKEditor em um valor float válido
// Devem ser passados como argumentos todos os ids dos campos dos quais se quer os valores
export function getFormattedValues() {
	let formattedValues = [];
	for (let i = 0; i < arguments.length; i++) {
		let value = $('#' + arguments[i]).text();
		formattedValues[i] = value.match(/[a-z]/i) ? '' : parseFloat(value.replace(',', '.'));
	}
	return formattedValues;
}

// Deixa todos os resultados com o numero de casas decimais especificado. Caso o resultado não seja numérico, retorna 0.
export function truncate(numToBeTruncated, numOfDecimals) {
	let number = numToBeTruncated.toString();
	let pointIndex = number.indexOf('.');
	let truncatedNumber = +(number.slice(0,
		pointIndex > -1 ? ++numOfDecimals + pointIndex : undefined));

	if ( $.isNumeric(truncatedNumber) ) {
		return truncatedNumber;
	} else {
		return '-';
	}
}

// Checa se todos os argumentos passados são números(evita ter que ficar chamado isNumeric para todos os elementos manualmente)
export function checkNumeric(values) {
	for (let i = 0; i < values.length; i++) {
		if ( !$.isNumeric(values[i]) ) {
			return false;
		}
	}
	return true;
}

function selectFirstEditableCell(editor) {
	const position = new ViewPosition(editor.editing.view.document.getRoot(), [0]);
	const walker = new ViewTreeWalker({startPosition: position});
	for (let element of walker) {
		if ( element.type === 'elementStart' && element.item._attrs.get('contenteditable') === 'true' ) {
			editor.editing.view.change(writer => {
				writer.setSelection(element.item, 'in');
			});
			return;
		}
	}
}

// Add eventos
export function addCustomEvents(editor) {

	selectFirstEditableCell(editor);

	const ckDocument = editor.editing.view.document;

	// Seleciona conteudo da celular no focus
	ckDocument.on('selectionChange', (evt, data) => {
		evt.stop();
		const current = ckDocument.selection.getFirstRange().start;
		if ( current.parent && current.parent.parent && current.parent.parent.name === 'td' ) {
			editor.editing.view.change(writer => {
				writer.setSelection(current.parent.parent, 'in');
			});
		}
	});

	// Utiliza enter para avançar celulas
	ckDocument.on('keydown', (evt, data) => {
		evt.stop();
		if ( data.keyCode === keyCodes.enter ) {
			let current = ckDocument.selection.getFirstRange();
			let position = new ViewPosition(current.start.parent);
			let walker = new ViewTreeWalker({startPosition: position});
			for (let element of walker) {
				if ( element.type === 'elementStart' && element.item._attrs.get('tabindex')) {
					editor.editing.view.change(writer => {
						writer.setSelection(element.item, 'in');
					});
					return;
				}
			}
			selectFirstEditableCell(editor);
		}
	});
}

function inArray(needle, haystack) {
	const length = haystack.length;
	for (let i = 0; i < length; i++) {
		if ( haystack[i] === needle )
			return true;
	}
	return false;
}
