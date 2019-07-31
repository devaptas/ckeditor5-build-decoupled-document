import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import InsertCardioCompCommand from './InsertCardioCompCommand';
import {
    toWidget,
    toWidgetEditable,
} from '@ckeditor/ckeditor5-widget/src/utils';
import {makeCalculations, selectAllOnFocus} from '../../cardio-utils/src/CardioUtils';

export default class CardioCompEditing extends Plugin {

    static get requires() {
        return [Widget];
    }

    init() {
        this._defineSchema();
        this._defineConverters();
        this._initializeEditorEvents();
        this.editor.commands.add('insertCardioComp', new InsertCardioCompCommand(this.editor));
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('cardioComp', {
            isObject: true,
            allowWhere: '$block',
        });

        schema.register('cardioCompTBody', {
            allowIn: 'cardioComp',
            allowContentOf: '$block',
        });

        schema.register('cardioCompRow', {
            allowIn: 'cardioCompTBody',
            allowContentOf: '$block',
        });

        schema.register('cardioCompSectionCell', {
            allowIn: 'cardioCompRow',
            allowContentOf: '$block',
        });

        schema.register('cardioCompLabelCell', {
            allowIn: 'cardioCompRow',
            allowContentOf: '$block',
        });

        schema.register('cardioCompInputCell', {
            // Cannot be split or left by the caret.
            isLimit: true,
            allowIn: 'cardioCompRow',
            allowAttributes: ['id'],
            allowContentOf: '$block',
        });

        schema.register('cardioCompUnitCell', {
            allowIn: 'cardioCompRow',
            allowContentOf: '$block',
        });

        schema.register('cardioCompAutoValueCell', {
            allowIn: 'cardioCompRow',
            allowAttributes: ['id'],
            allowContentOf: '$block',
        });

        schema.register('cardioCompRefInputCell', {
            allowIn: 'cardioCompRow',
            allowAttributes: ['id'],
            allowContentOf: '$block',
        });
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        /***
         * cardioCompTable
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioComp',
            view: {
                name: 'table',
                classes: 'cardio-comp-table',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioComp',
            view: (modelElement, viewWriter) => {
                const table = viewWriter.createContainerElement('table', {
                    class: 'cardio-comp-table',
                    style: 'width:100%; font-size:10pt;',
                });
                return toWidget(table, viewWriter, {label: 'cardioComp widget'});
            },
        });

        /***
         * cardioCompTBody
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompTBody',
            view: {
                name: 'tbody',
                classes: 'cardio-comp-tbody',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompTBody',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('tbody', {
                    class: 'cardio-comp-tbody',
                });
            },
        });

        /***
         * cardioCompRow
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompRow',
            view: {
                name: 'tr',
                classes: 'cardio-comp-row',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompRow',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('tr',
                    {class: 'cardio-comp-row'});
            },
        });

        /***
         * cardioCompSectionCell
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompSectionCell',
            view: {
                name: 'td',
                classes: 'cardio-comp-section-cell',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompSectionCell',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('td', {
                    class: 'cardio-comp-section-cell',
                    style: 'font-weight:bold; padding-top:10px;',
                    colspan: 4
                });
            },
        });

        /***
         * cardioCompLabelCell
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompLabelCell',
            view: {
                name: 'td',
                classes: 'cardio-comp-label-cell',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompLabelCell',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('td', {
                    class: 'cardio-comp-label-cell',
                    style: 'white-space:nowrap;',
                });
            },
        });

        /***
         * cardioCompInputCell
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: (viewElement, modelWriter) => {
                return modelWriter.createElement('cardioCompInputCell', {
                    id: viewElement.getAttribute('id'),
                });
            },
            view: {
                name: 'td',
                classes: 'cardio-comp-input-cell',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompInputCell',
            view: (modelElement, viewWriter) => {
                const td = viewWriter.createEditableElement('td', {
                    id: modelElement.getAttribute('id'),
                    class: 'cardio-comp-input-cell',
                    style: 'border:1px solid black; padding:2px; width:80px; text-align:right; white-space:nowrap;',
                });
                return toWidgetEditable(td, viewWriter);
            },
        });

        /***
         * cardioCompUnitCell
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompUnitCell',
            view: {
                name: 'td',
                classes: 'cardio-comp-unit-cell',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompUnitCell',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('td', {
                    class: 'cardio-comp-unit-cell',
                    style: 'padding-left:2px; width:80px; white-space:nowrap;',
                });
            },
        });

        /***
         * cardioCompAutoValueCell
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: (viewElement, modelWriter) => {
                return modelWriter.createElement('cardioCompAutoValueCell', {
                    id: viewElement.getAttribute('id'),
                });
            },
            view: {
                name: 'td',
                classes: 'cardio-comp-auto-value-cell',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompAutoValueCell',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('td', {
                    id: modelElement.getAttribute('id'),
                    class: 'cardio-comp-auto-value-cell',
                    style: 'white-space:nowrap; text-align:right',
                });
            },
        });

        /***
         * cardioCompRefInputCell
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: (viewElement, modelWriter) => {
                return modelWriter.createElement('cardioCompRefInputCell', {
                    id: viewElement.getAttribute('id'),
                });
            },
            view: {
                name: 'td',
                classes: 'cardio-comp-ref-input-cell',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompRefInputCell',
            view: (modelElement, viewWriter) => {
                const td = viewWriter.createEditableElement('td', {
                    id: modelElement.getAttribute('id'),
                    class: 'cardio-comp-ref-input-cell',
                    style: 'padding:2px; width:80px; white-space:nowrap; text-align:left',
                });
                return toWidgetEditable(td, viewWriter);
            },
        });

    }

    _initializeEditorEvents() {
        this.editor.model.document.on('change:data', (evt, data) => {
            let editor = this.editor;
            let editableElement = editor.editing.view.document.selection.editableElement;
            if ( editableElement && editableElement.hasClass('cardio-comp-input-cell') ) {
                makeCalculations(editableElement.getAttribute('id'), editor);
            }
        });
        selectAllOnFocus('.cardio-comp-input-cell, .cardio-comp-ref-input-cell');
    }
}

