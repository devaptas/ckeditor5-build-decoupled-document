import Command from '@ckeditor/ckeditor5-core/src/command';
import {addCustomEvents} from '../../cardio-utils/src/CardioUtils';

export default class InsertLeftVentrDiastFuncCommand extends Command {

    execute() {
        const editor = this.editor;
        editor.model.change( () => {
            const viewFragment = editor.data.processor.toView( createCardioCompTable() );
            const modelFragment = editor.data.toModel( viewFragment );
            const range = editor.model.insertContent( modelFragment, editor.model.document.selection );
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
        // reffmoe: '60 - 100 cm/s',
        // reffmoa: '30 - 70 cm/s',
        refes: '> 7 cm/s',
        refel: '> 10 cm/s',
        // refrea: '1,1 - 1,7',
        refmree: '< 14',
        // reftdm: '180 +- 31 ms',
		refvit: '< 280 cm/s'
    };

    let tabIndex = 0;

    return '<table class="cardio-comp-table">' +
        '<tbody class="cardio-comp-tbody">' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-section-cell">Parâmetros: Função Diastólica do VE:</td>' +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">Fluxo Mitral Onda E:</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="fmoe"></td>` +
                '<td class="cardio-comp-unit-cell">cm/s</td>' +
                `<td class="cardio-comp-ref-input-cell" id="reffmoe">${(references['reffmoe'] || '-')}</td>` +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">Fluxo Mitral Onda A:</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="fmoa"></td>` +
                '<td class="cardio-comp-unit-cell">cm/s</td>' +
                `<td class="cardio-comp-ref-input-cell" id="reffmoa">${(references['reffmoa'] || '-')}</td>` +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">e\' Septal:</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="es"></td>` +
                '<td class="cardio-comp-unit-cell">cm/s</td>' +
                `<td class="cardio-comp-ref-input-cell" id="refes">${(references['refes'] || '-')}</td>` +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">e\' Lateral:</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="el"></td>` +
                '<td class="cardio-comp-unit-cell">cm/s</td>' +
                `<td class="cardio-comp-ref-input-cell" id="refel">${(references['refel'] || '-')}</td>` +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">Relação E/A:</td>' +
                `<td class="cardio-comp-auto-value-cell" id="rea">-</td>` +
                '<td class="cardio-comp-unit-cell"></td>' +
                `<td class="cardio-comp-ref-input-cell" id="refrea">${(references['refrea'] || '-')}</td>` +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">Média Rel E/e\':</td>' +
                `<td class="cardio-comp-auto-value-cell" id="mree">-</td>` +
                '<td class="cardio-comp-unit-cell"></td>' +
                `<td class="cardio-comp-ref-input-cell" id="refmree">${(references['refmree'] || '-')}</td>` +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">TD Mitral:</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="tdm"></td>` +
                '<td class="cardio-comp-unit-cell">ms</td>' +
                `<td class="cardio-comp-ref-input-cell" id="reftdm">${(references['reftdm'] || '-')}</td>` +
            '</tr>' +

			'<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">Veloc. Da Insuf. Tricúspide:</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="tdm"></td>` +
                '<td class="cardio-comp-unit-cell">ms</td>' +
                `<td class="cardio-comp-ref-input-cell" id="reftdm">${(references['refvit'] || '-')}</td>` +
            '</tr>' +

        '</tbody>' +
    '</table>';
}
