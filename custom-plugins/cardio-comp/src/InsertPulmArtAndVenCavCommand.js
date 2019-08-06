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

            '<tr class="cardio-comp-row" id="tr-psap">' +
                '<td class="cardio-comp-label-cell">PSAP:</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="psap"></td>` +
                '<td class="cardio-comp-unit-cell">mmHg</td>' +
                `<td class="cardio-comp-ref-input-cell" id="refpsap">${(references['refpsap'] || '-')}</td>` +
				'<td class="cardio-comp-cell">' +
					'<button class="btn btn-xs btn-danger btn-remove" data-trid="tr-psap">x</button>' +
				'</td>' +
            '</tr>' +

            '<tr class="cardio-comp-row" id="tr-pead">' +
                '<td class="cardio-comp-label-cell">Pressão Estimada do Átrio Direito:</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="pead"></td>` +
                '<td class="cardio-comp-unit-cell">mmHg</td>' +
                `<td class="cardio-comp-ref-input-cell" id="refpead">${(references['refpead'] || '-')}</td>` +
				'<td class="cardio-comp-cell">' +
					'<button class="btn btn-xs btn-danger btn-remove" data-trid="tr-pead">x</button>' +
				'</td>' +
            '</tr>' +

            '<tr class="cardio-comp-row" id="tr-vci">' +
                '<td class="cardio-comp-label-cell">Veia Cava Inferior:</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="vci"></td>` +
                '<td class="cardio-comp-unit-cell">mm</td>' +
                `<td class="cardio-comp-ref-input-cell" id="refvci">${(references['refvci'] || '-')}</td>` +
				'<td class="cardio-comp-cell">' +
					'<button class="btn btn-xs btn-danger btn-remove" data-trid="tr-vci">x</button>' +
				'</td>' +
            '</tr>' +

            '<tr class="cardio-comp-row" id="tr-vcie">' +
                '<td class="cardio-comp-label-cell">Veia Cava Inferior (Expiração):</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="vcie"></td>` +
                '<td class="cardio-comp-unit-cell">mm</td>' +
                `<td class="cardio-comp-ref-input-cell" id="refvcie">${(references['refvcie'] || '-')}</td>` +
				'<td class="cardio-comp-cell">' +
					'<button class="btn btn-xs btn-danger btn-remove" data-trid="tr-vcie">x</button>' +
				'</td>' +
            '</tr>' +

            '<tr class="cardio-comp-row" id="tr-vvci">' +
                '<td class="cardio-comp-label-cell">Variação Veia Cava Inferior:</td>' +
                '<td class="cardio-comp-auto-value-cell" id="vvci"></td>' +
                '<td class="cardio-comp-unit-cell">%</td>' +
                `<td class="cardio-comp-ref-input-cell" id="refvvci">${(references['refvvci'] || '-')}</td>` +
				'<td class="cardio-comp-cell">' +
					'<button class="btn btn-xs btn-danger btn-remove" data-trid="tr-vvci">x</button>' +
				'</td>' +
            '</tr>' +
        '</tbody>' +
    '</table>';
}
