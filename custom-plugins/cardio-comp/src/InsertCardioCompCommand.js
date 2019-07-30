import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertCardioCompCommand extends Command {

    execute() {
        const editor = this.editor;
        editor.model.change( () => {
            const viewFragment = editor.data.processor.toView( createCardioCompTable() );
            const modelFragment = editor.data.toModel( viewFragment );
            editor.model.insertContent( modelFragment, editor.model.document.selection );
        } );
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
        reffmoe: '60 - 100 cm/s',
        reffmoa: '30 - 70 cm/s',
        refes: '< 6 cm/s',
        refel: '< 8 cm/s',
        refrea: '1,1 - 1,7',
        refmree: '> 6',
        reftdm: '180 +- 31 ms',
        refpsap: '35 - 40 mmHg',
        refpead: '< 5 mmHg',
        refvci: '< 21 mm',
        refvcie: 'colapso espontâneo = 0',
        refvvci: '> 50 %',
    };

    return '<table class="cardio-comp-table">' +
        '<tbody class="cardio-comp-tbody">' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-section-cell">Parâmetros: Função Diastólica do VE:</td>' +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">Fluxo Mitral Onda E:</td>' +
                '<td class="cardio-comp-input-cell" id="fmoe"></td>' +
                '<td class="cardio-comp-unit-cell">cm/s</td>' +
                `<td class="cardio-comp-ref-input-cell" id="reffmoe">${(references['reffmoe'] || '-')}</td>` +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">Fluxo Mitral Onda A:</td>' +
                '<td class="cardio-comp-input-cell" id="fmoa"></td>' +
                '<td class="cardio-comp-unit-cell">cm/s</td>' +
                `<td class="cardio-comp-ref-input-cell" id="reffmoa">${(references['reffmoa'] || '-')}</td>` +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">e\' Septal:</td>' +
                '<td class="cardio-comp-input-cell" id="es"></td>' +
                '<td class="cardio-comp-unit-cell">cm/s</td>' +
                `<td class="cardio-comp-ref-input-cell" id="refes">${(references['refes'] || '-')}</td>` +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">e\' Lateral:</td>' +
                '<td class="cardio-comp-input-cell" id="el"></td>' +
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
                '<td class="cardio-comp-input-cell" id="tdm"></td>' +
                '<td class="cardio-comp-unit-cell">ms</td>' +
                `<td class="cardio-comp-ref-input-cell" id="reftdm">${(references['reftdm'] || '-')}</td>` +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-section-cell">Pressão Sistólica da Artéria Pulmonar e Veia Cava:</td>' +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">PSAP:</td>' +
                '<td class="cardio-comp-input-cell" id="psap"></td>' +
                '<td class="cardio-comp-unit-cell">mmHg</td>' +
                `<td class="cardio-comp-ref-input-cell" id="refpsap">${(references['refpsap'] || '-')}</td>` +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">Pressão Estimada do Átrio Direito:</td>' +
                '<td class="cardio-comp-input-cell" id="pead"></td>' +
                '<td class="cardio-comp-unit-cell">mmHg</td>' +
                `<td class="cardio-comp-ref-input-cell" id="refpead">${(references['refpead'] || '-')}</td>` +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">Veia Cava Inferior:</td>' +
                '<td class="cardio-comp-input-cell" id="vci"></td>' +
                '<td class="cardio-comp-unit-cell">mm</td>' +
                `<td class="cardio-comp-ref-input-cell" id="refvci">${(references['refvci'] || '-')}</td>` +
            '</tr>' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-label-cell">Veia Cava Inferior (Expiração):</td>' +
                '<td class="cardio-comp-input-cell" id="vcie"></td>' +
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
