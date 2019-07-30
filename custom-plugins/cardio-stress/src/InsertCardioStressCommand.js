import Command from '@ckeditor/ckeditor5-core/src/command';
import {stressHeader} from '../img/stressHeader';

export default class InsertCardioStressCommand extends Command {

    execute() {
    	const editor = this.editor;
        editor.model.change( () => {
			const viewFragment = editor.data.processor.toView( createCardioStressTable() );
            const modelFragment = editor.data.toModel( viewFragment );
            editor.model.insertContent( modelFragment, editor.model.document.selection );
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'cardioStress' );
        this.isEnabled = allowedIn !== null;
    }
}

function createCardioStressTable() {
	return '<table class="cardio-stress-table">' +
		'<tbody class="cardio-stress-tbody">' +

			// Header img
			'<tr class="cardio-stress-row">' +
				'<td class="cardio-stress-cell">' +
					`<img class="cardio-stress-img" src="${stressHeader()}" alt="header"/>` +
				'</td>'+
			'</tr>'+

			// Repouso
			'<tr class="cardio-stress-row">' +
				'<td class="cardio-stress-cell">' +
					'Repouso: Índice de Escore de contratilidade da Parede: <span class="cardio-stress-caption" id="rep">1.00 (Valor Normal)</span>' +
				'</td>'+
			'</tr>'+
			'<tr class="cardio-stress-row">' +
				'<td class="cardio-stress-cell">' +
					renderStressInputTable('rep') +
				'</td>'+
			'</tr>'+

			// Pico do esforço
			'<tr class="cardio-stress-row">' +
				'<td class="cardio-stress-cell">' +
					'Pico do Esforço: Índice de Escore de contratilidade da Parede: <span class="cardio-stress-caption" id="esf">1.00 (Valor Normal)</span>' +
				'</td>'+
			'</tr>'+
			'<tr class="cardio-stress-row">' +
				'<td class="cardio-stress-cell">' +
					renderStressInputTable('esf') +
				'</td>'+
			'</tr>'+

			// Recuperação
			'<tr class="cardio-stress-row">' +
				'<td class="cardio-stress-cell">' +
					'Recuperação: Índice de Escore de contratilidade da Parede: <span class="cardio-stress-caption" id="rec">1.00 (Valor Normal)</span>' +
				'</td>'+
			'</tr>'+
			'<tr class="cardio-stress-row">' +
				'<td class="cardio-stress-cell">' +
					renderStressInputTable('rec') +
				'</td>'+
			'</tr>'+

			// Legenda
			'<tr class="cardio-stress-row">' +
				'<td class="cardio-stress-cell">' +
					'<p class="cardio-stress-legend">' +
						'<b>Índice de Contratilidade: </b>' +
						'<span>0-Não Visualizada, 1-Contrat. Normal, 2-Hipocinesia, 3-Acinesia, 4-Dicinesia</span>'  +
					'</p>' +
					'<p class="cardio-stress-legend">' +
						'<b>Escore de Contratilidade: </b>' +
						'<span>1-Valor Normal, >1 e <1,6-Disfunção Discreta, >1,6 e <2,0-Disfunção Moderada, >2,0-Disfunção Importante</span>'  +
					'</p>' +
				'</td>'+
			'</tr>'+
		'</tbody>' +
	'</table>';
}

function renderStressInputTable(levelID){
	return '<div class="cardio-stress-input-content">' +
		'<div class="cardio-stress-input-column">' +
			'<table class="cardio-stress-input-table">'+
				'<tbody class="cardio-stress-input-tbody">'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red">2</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red">8</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red">14</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red">17</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-yellow">16</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-yellow">11</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-yellow">5</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
				'</tbody>' +
			'</table>'+
		'</div>' +
		'<div class="cardio-stress-input-column">' +
			'<table class="cardio-stress-input-table">'+
				'<tbody class="cardio-stress-input-tbody">'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red">1</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red">2</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-green">3</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-green">4</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-yellow">5</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-yellow">6</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
				'</tbody>' +
			'</table>'+
		'</div>' +
		'<div class="cardio-stress-input-column">' +
			'<table class="cardio-stress-input-table">'+
				'<tbody class="cardio-stress-input-tbody">'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-green">3</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-green">9</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red">14</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red">17</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-yellow">16</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-yellow">12</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-yellow">6</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
				'</tbody>' +
			'</table>'+
		'</div>' +
		'<div class="cardio-stress-input-column">' +
			'<table class="cardio-stress-input-table">'+
				'<tbody class="cardio-stress-input-tbody">'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-green">4</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-green">10</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-green">15</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red">17</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red">13</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red">7</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red">1</td>'+
						`<td class="cardio-stress-cell-${levelID}">1</td>`+
					'</tr>'+
				'</tbody>' +
			'</table>'+
		'</div>' +
	'</div>';
}





