import Command from '@ckeditor/ckeditor5-core/src/command';
import {addCustomEvents} from '../../cardio-utils/src/CardioUtils';

export default class InsertLeftVentrDiastFuncCommand extends Command {

    execute() {
        const editor = this.editor;
        editor.model.change( () => {
            const viewFragment = editor.data.processor.toView( createCardioCompTable() );
            const modelFragment = editor.data.toModel( viewFragment );
            editor.model.insertContent( modelFragment, editor.model.document.selection );
        } );
        addCustomEvents(editor);
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'cardioComp' );
        this.isEnabled = allowedIn !== null;
    }
}

function createCardioCompTable() {

    const references = {
        // refpsap: '35 - 40 mmHg',
        // refpead: '< 5 mmHg',
        // refvci: '< 21 mm',
        // refvcie: 'colapso espontâneo = 0',
        // refvvci: '> 50 %',
    };

    let tabIndex = 0;

    return '<table class="cardio-comp-table">' +
        '<tbody class="cardio-comp-tbody">' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-section-cell">Pressão Sistólica da Artéria Pulmonar e Veia Cava:</td>' +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">PSAP:</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="psap"></td>` +
                '<td class="cardio-comp-unit-cell">mmHg</td>' +
                `<td class="cardio-comp-ref-input-cell" id="refpsap">${(references['refpsap'] || '-')}</td>` +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">Pressão Estimada do Átrio Direito:</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="pead"></td>` +
                '<td class="cardio-comp-unit-cell">mmHg</td>' +
                `<td class="cardio-comp-ref-input-cell" id="refpead">${(references['refpead'] || '-')}</td>` +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">Veia Cava Inferior:</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="vci"></td>` +
                '<td class="cardio-comp-unit-cell">mm</td>' +
                `<td class="cardio-comp-ref-input-cell" id="refvci">${(references['refvci'] || '-')}</td>` +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">Veia Cava Inferior (Expiração):</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="vcie"></td>` +
                '<td class="cardio-comp-unit-cell">mm</td>' +
                `<td class="cardio-comp-ref-input-cell" id="refvcie">${(references['refvcie'] || '-')}</td>` +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">Variação Veia Cava Inferior:</td>' +
                '<td class="cardio-comp-auto-value-cell" id="vvci"></td>' +
                '<td class="cardio-comp-unit-cell">%</td>' +
                `<td class="cardio-comp-ref-input-cell" id="refvvci">${(references['refvvci'] || '-')}</td>` +
            '</tr>' +
        '</tbody>' +
    '</table>';
}
