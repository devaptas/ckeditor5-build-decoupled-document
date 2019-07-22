import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import InsertCardioCommand from './InsertCardioCommand';
import {
    toWidget,
    toWidgetEditable,
} from '@ckeditor/ckeditor5-widget/src/utils';
import {makeCalculations} from './utils';

export default class CardioEditing extends Plugin {

    static get requires() {
        return [Widget];
    }

    init() {
        this._defineSchema();
        this._defineConverters();
        this._initializeEditorEvents();

        this.editor.commands.add('insertCardio', new InsertCardioCommand(this.editor));
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('cardio', {
            isObject: true,
            allowWhere: '$block',
        });

        schema.register('cardioTBody', {
            allowIn: 'cardio',
            allowContentOf: '$block',
        });

        schema.register('cardioRow', {
            allowIn: 'cardioTBody',
            allowContentOf: '$block',
        });

        schema.register('cardioSectionCell', {
            allowIn: 'cardioRow',
            allowContentOf: '$block',
        });

        schema.register('cardioLabelCell', {
            allowIn: 'cardioRow',
            allowContentOf: '$block',
        });

        schema.register('cardioInputCell', {
            // Cannot be split or left by the caret.
            isLimit: true,
            allowIn: 'cardioRow',
            allowAttributes: ['id'],
            allowContentOf: '$block',
        });

        schema.register('cardioUnitCell', {
            allowIn: 'cardioRow',
            allowContentOf: '$block',
        });

        schema.register('cardioAutoValueCell', {
            allowIn: 'cardioRow',
            allowAttributes: ['id'],
            allowContentOf: '$block',
        });

        schema.register('cardioRefCell', {
            allowIn: 'cardioRow',
            allowAttributes: ['id'],
            allowContentOf: '$block',
        });

    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        /***
         * cardioTable
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardio',
            view: {
                name: 'table',
                classes: 'cardio-table',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardio',
            view: (modelElement, viewWriter) => {
                const table = viewWriter.createContainerElement('table', {
                    class: 'cardio-table',
                    style: 'width:100%; font-size:10pt;',
                });
                return toWidget(table, viewWriter, {label: 'cardio widget'});
            },
        });

        /***
         * cardioTBody
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioTBody',
            view: {
                name: 'tbody',
                classes: 'cardio-tbody',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioTBody',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('tbody', {
                    class: 'cardio-tbody',
                });
            },
        });

        /***
         * cardioRow
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioRow',
            view: {
                name: 'tr',
                classes: 'cardio-row',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioRow',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('tr',
                    {class: 'cardio-row'});
            },
        });

        /***
         * cardioSectionCell
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioSectionCell',
            view: {
                name: 'td',
                classes: 'cardio-section-cell',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioSectionCell',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('td', {
                    class: 'cardio-section-cell',
                    style: 'font-weight:bold; padding-top:8px; ',
                    colspan: 4,

                });
            },
        });

        /***
         * cardioLabelCell
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioLabelCell',
            view: {
                name: 'td',
                classes: 'cardio-label-cell',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioLabelCell',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('td', {
                    class: 'cardio-label-cell',
                    style: 'white-space:nowrap;',
                });
            },
        });

        /***
         * cardioInputCell
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: (viewElement, modelWriter) => {
                return modelWriter.createElement('cardioInputCell', {
                    id: viewElement.getAttribute('id'),
                });
            },
            view: {
                name: 'td',
                classes: 'cardio-input-cell',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioInputCell',
            view: (modelElement, viewWriter) => {
                const id = modelElement.getAttribute('id');
                const td = viewWriter.createEditableElement('td', {
                    id: id,
                    class: 'cardio-input-cell',
                    style: 'border:1px solid black; padding:2px; width:50px; text-align:right',
                });
                return toWidgetEditable(td, viewWriter);
            },
        });

        /***
         * cardioUnitCell
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioUnitCell',
            view: {
                name: 'td',
                classes: 'cardio-unit-cell',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioUnitCell',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('td', {
                    class: 'cardio-unit-cell',
                    style: 'padding-left:2px; width:80px; white-space:nowrap;',
                });
            },
        });

        /***
         * cardioAutoValueCell
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: (viewElement, modelWriter) => {
                return modelWriter.createElement('cardioAutoValueCell', {
                    id: viewElement.getAttribute('id'),
                });
            },
            view: {
                name: 'td',
                classes: 'cardio-auto-value-cell',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioAutoValueCell',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('td', {
                    id: modelElement.getAttribute('id'),
                    class: 'cardio-auto-value-cell',
                    style: 'white-space:nowrap; text-align:right',
                });
            },
        });

        /***
         * cardioRefCell
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: (viewElement, modelWriter) => {
                return modelWriter.createElement('cardioRefCell', {
                    id: viewElement.getAttribute('id'),
                });
            },
            view: {
                name: 'td',
                classes: 'cardio-ref-cell',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioRefCell',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('td', {
                    id: modelElement.getAttribute('id'),
                    class: 'cardio-ref-cell',
                    style: 'white-space:nowrap;',
                });
            },
        });
    }

    _initializeEditorEvents() {
        this.editor.model.document.on('change:data', () => {
            let editor = this.editor;
            let editableElement = editor.editing.view.document.selection.editableElement;
            if ( editableElement && editableElement.hasClass('cardio-input-cell') ) {
                makeCalculations(editableElement.getAttribute('id'), editor);
            }
        });
    }
}

