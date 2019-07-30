import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import InsertCardioStressCommand from './InsertCardioStressCommand';
import {
	toWidget,
	toWidgetEditable,
} from '@ckeditor/ckeditor5-widget/src/utils';
import {stressHeader} from '../img/stressHeader';
import {makeStressCalculations} from '../../cardio-utils/src/CardioUtils';

export default class CardioStressEditing extends Plugin {

	static get requires() {
		return [Widget];
	}

	init() {
		this._defineSchema();
		this._defineConverters();
		this._initializeEditorEvents();
		this.editor.commands.add('insertCardioStress', new InsertCardioStressCommand(this.editor));
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register('cardioStress', {
			isObject: true,
			allowWhere: '$block',
		});

		schema.register('cardioStressTBody', {
            allowIn: 'cardioStress',
            allowContentOf: '$block',
        });

		schema.register('cardioStressRow', {
			allowIn: 'cardioStressTBody',
			allowContentOf: '$block',
		});

		schema.register('cardioStressCell', {
			allowIn: 'cardioStressRow',
			allowContentOf: '$block',
		});

		schema.register('cardioStressImg', {
			allowIn: 'cardioStressCell',
			allowContentOf: '$block',
			allowAttributes: ['src']
		});

		schema.register('cardioStressCaption', {
			allowIn: 'cardioStressCell',
			allowContentOf: '$block',
			allowAttributes: ['id'],
		});

		schema.register('cardioStressLegend', {
			allowIn: 'cardioStressCell',
			allowContentOf: '$block',
		});

		schema.register('cardioStressInputContent', {
			allowIn: 'cardioStressCell',
			allowContentOf: '$block',
		});

		schema.register('cardioStressInputColumn', {
			allowIn: 'cardioStressInputContent',
			allowContentOf: '$block'
		});


		schema.register('cardioStressInputTable', {
			allowIn: 'cardioStressInputColumn',
			allowContentOf: '$block'
		});

		schema.register('cardioStressInputTbody', {
			allowIn: 'cardioStressInputTable',
			allowContentOf: '$block'
		});

		schema.register('cardioStressInputRow', {
			allowIn: 'cardioStressInputTbody',
			allowContentOf: '$block'
		});

		schema.register('cardioStressCellGreen', {
			allowIn: 'cardioStressInputRow',
			allowContentOf: '$block'
		});

		schema.register('cardioStressCellYellow', {
			allowIn: 'cardioStressInputRow',
			allowContentOf: '$block'
		});

		schema.register('cardioStressCellRed', {
			allowIn: 'cardioStressInputRow',
			allowContentOf: '$block'
		});

		schema.register('cardioStressCellRep', {
			allowIn: 'cardioStressInputRow',
			allowContentOf: '$block',
			isLimit: true
		});

		schema.register('cardioStressCellEsf', {
			allowIn: 'cardioStressInputRow',
			allowContentOf: '$block',
			isLimit: true
		});

		schema.register('cardioStressCellRec', {
			allowIn: 'cardioStressInputRow',
			allowContentOf: '$block',
			isLimit: true
		});
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		/***
         * cardioStressTable
         ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStress',
			view: {
				name: 'table',
				classes: 'cardio-stress-table',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStress',
			view: (modelElement, viewWriter) => {
				const table = viewWriter.createContainerElement('table', {
                    class: 'cardio-stress-table',
                    style: 'width:100%; font-size:10pt;',
                });
				return toWidget(table, viewWriter, {label: 'cardioStress widget'});
			},
		});

		/***
         * cardioStressTBody
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressTBody',
            view: {
                name: 'tbody',
                classes: 'cardio-stress-tbody',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressTBody',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('tbody', {
                    class: 'cardio-stress-tbody',
                });
            },
        });

		/***
         * cardioStressRow
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressRow',
            view: {
                name: 'tr',
                classes: 'cardio-stress-row',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressRow',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('tr',
                    {class: 'cardio-stress-row'});
            },
        });

		/***
         * cardioStressCell
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressCell',
            view: {
                name: 'td',
                classes: 'cardio-stress-cell',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressCell',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('td', {
                    class: 'cardio-stress-cell',
                });
            },
        });

        /***
         * cardioStressImg
         ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressImg',
			view: {
				name: 'img',
				src: stressHeader(),
				classes: 'cardio-stress-img',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressImg',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('img', {
					src: stressHeader(),
					class: 'cardio-stress-img',
					style: 'width:100%;',
				});
			},
		});

		/***
         * cardioStressCaption
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
			model: (viewElement, modelWriter) => {
                return modelWriter.createElement('cardioStressCaption', {
                    id: viewElement.getAttribute('id'),
                });
            },
            view: {
                name: 'span',
                classes: 'cardio-stress-caption',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressCaption',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('span', {
                	id: modelElement.getAttribute('id'),
                    class: 'cardio-stress-caption',
                    style: 'font-weight:600;',
                });
            },
        });

		/***
         * cardioStressInputContent
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
			model: 'cardioStressInputContent',
            view: {
                name: 'div',
                classes: 'cardio-stress-input-content',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressInputContent',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('div', {
                    class: 'cardio-stress-input-content',
                    style: 'width:100%',
                });
            },
        });

		/***
         * cardioStressInputColumn
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
			model: 'cardioStressInputColumn',
            view: {
                name: 'div',
                classes: 'cardio-stress-input-column',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressInputColumn',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('div', {
                    class: 'cardio-stress-input-column',
                    style: 'width:25%; display:inline-block',
                });
            },
        });

		/***
         * cardioStressInputTable
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressInputTable',
            view: {
                name: 'table',
                classes: 'cardio-stress-input-table',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressInputTable',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('table', {
					class: 'cardio-stress-input-table',
					style: 'margin:0 auto;'
                });
            },
        });

        /***
         * cardioStressInputTbody
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressInputTbody',
            view: {
                name: 'tbody',
                classes: 'cardio-stress-input-tbody',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressInputTbody',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('tbody',
                    {class: 'cardio-stress-input-tbody'});
            },
        });

		/***
         * cardioStressInputRow
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressInputRow',
            view: {
                name: 'tr',
                classes: 'cardio-stress-input-row',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressInputRow',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('tr',
                    {class: 'cardio-stress-input-row'});
            },
        });

		/***
         * cardioStressCellGreen
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressCellGreen',
            view: {
                name: 'td',
                classes: 'cardio-stress-cell-green'
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressCellGreen',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('td', {
                    class: 'cardio-stress-cell-green',
                    style: 'text-align:center; background-color:#4e9900; border:1px solid lightgray; width:25px;',
                });
            },
        });

		/***
         * cardioStressCellYellow
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressCellYellow',
            view: {
                name: 'td',
                classes: 'cardio-stress-cell-yellow'
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressCellYellow',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('td', {
                    class: 'cardio-stress-cell-yellow',
                    style: 'text-align:center; background-color:#f7ba36; border:1px solid lightgray; width:25px;',
                });
            },
        });

		/***
         * cardioStressCellRed
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressCellRed',
            view: {
                name: 'td',
                classes: 'cardio-stress-cell-red'
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressCellRed',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('td', {
                    class: 'cardio-stress-cell-red',
                    style: 'text-align:center; background-color:#db323e; border:1px solid lightgray; width:25px;',
                });
            },
        });

		/***
         * cardioStressCellRep
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressCellRep',
            view: {
                name: 'td',
                classes: 'cardio-stress-cell-rep'
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressCellRep',
            view: (modelElement, viewWriter) => {
                const td = viewWriter.createEditableElement('td', {
                    class: 'cardio-stress-cell-rep',
                    style: 'text-align:center;  border:1px solid lightgray; width:25px;',
                });
                return toWidgetEditable(td, viewWriter);
            },
        });

		/***
         * cardioStressCellEsf
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressCellEsf',
            view: {
                name: 'td',
                classes: 'cardio-stress-cell-esf'
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressCellEsf',
            view: (modelElement, viewWriter) => {
                const td = viewWriter.createEditableElement('td', {
                    class: 'cardio-stress-cell-esf',
                    style: 'text-align:center;  border:1px solid lightgray; width:25px;',
                });
                return toWidgetEditable(td, viewWriter);
            },
        });

		/***
         * cardioStressCellRec
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressCellRec',
            view: {
                name: 'td',
                classes: 'cardio-stress-cell-rec'
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressCellRec',
            view: (modelElement, viewWriter) => {
                const td = viewWriter.createEditableElement('td', {
                    class: 'cardio-stress-cell-rec',
                    style: 'text-align:center;  border:1px solid lightgray; width:25px;',
                });
                return toWidgetEditable(td, viewWriter);
            },
        });

		/***
         * cardioStressLegend
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressLegend',
            view: {
                name: 'p',
                classes: 'cardio-stress-legend'
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioStressLegend',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('p', {
                    class: 'cardio-stress-legend',
                    style: 'font-size: 7pt',
                });
            },
        });


	}

	_initializeEditorEvents() {
		let editor = this.editor;
        editor.model.document.on('change:data', (evt, data) => {
            let editableElement = editor.editing.view.document.selection.editableElement;
            if ( editableElement ) {
                makeStressCalculations(editableElement, editor);
            }
        });
	}
}

