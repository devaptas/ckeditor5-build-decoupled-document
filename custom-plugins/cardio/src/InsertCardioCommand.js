import Command from '@ckeditor/ckeditor5-core/src/command';
import {addCustomEvents} from '../../cardio-utils/src/CardioUtils';

export default class InsertCardioCommand extends Command {

	execute() {
		const editor = this.editor;
		editor.model.change(() => {
			const viewFragment = editor.data.processor.toView(createCardioTable(editor));
			const modelFragment = editor.data.toModel(viewFragment);
			editor.model.insertContent(modelFragment, editor.model.document.selection);
		});
		addCustomEvents(editor);
	}

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'cardio');
		this.isEnabled = allowedIn !== null;
	}
}

function createCardioTable(editor) {

	const patientGender = editor.config.get('patientGender');
	const patientAgeYears = parseInt(editor.config.get('patientAgeYears'));
	const patientAgeMonths = parseInt(editor.config.get('patientAgeMonths'));
	let references = {};

	if ( patientAgeYears > 15 ) {
		if ( patientGender === 'M' ) {
			references = {
				refsao: '31 - 37 mm',
				refjsn: '26 - 32 mm',
				refaa: '26 - 34 mm',
				refaesq: '30 - 40 mm',
				refdbvd: '25 - 41 mm',
				refdpvsvd: '20 - 30 mm',
				refddfve: '42 - 58 mm',
				refdsfve: '25 - 40 mm',
				refeds: '06 - 10 mm',
				refedppve: '06 - 10 mm',
				refvaesc: '16 - 34 ml/m²',
				refddfvesc: '22 - 30 mm/m²',
				refdsfvesc: '13 - 21 mm/m²',
				refvdf: '62 - 150 ml',
				refvsf: '21 - 61 ml',
				refvsfsc: '11 - 31 ml/m²',
				refvdfsc: '34 - 74 ml/m²',
				reffes: '52 - 72 %',
				reffet: '52 - 72 %',
				refpec: '25 - 43 %',
				refmvesc: '45 - 115 g/m²',
				refmve: '96 - 200 g',
				referpve: '0,24 - 0,42 mm',
			};
		} else {

			references = {
				refsao: '27 - 33 mm',
				refjsn: '23 - 29 mm',
				refaa: '23 - 31 mm',
				refaesq: '27 - 38 mm',
				refdbvd: '25 - 41 mm',
				refdpvsvd: '20 - 30 mm',
				refddfve: '38 - 52 mm',
				refdsfve: '22 - 35 mm',
				refeds: '06 - 09 mm',
				refedppve: '06 - 09 mm',
				refvaesc: '16 - 34 ml/m²',
				refddfvesc: '23 -31 mm/m²',
				refdsfvesc: '13 - 21 mm/m²',
				refvdf: '46 - 106 ml',
				refvsf: '14 - 42 ml',
				refvsfsc: '8 - 24 ml/m²',
				refvdfsc: '29-61 ml/m²',
				reffes: '54 - 74 %',
				reffet: '52 - 72 %',
				refpec: '27 - 45 %',
				refmvesc: '43 - 95 g/m²',
				refmve: '66 - 150 g',
				referpve: '0,22 - 0,42 mm',
			};
		}

	} else {

		if ( patientAgeYears < 1 ) {
			if ( patientAgeMonths <= 3 ) {
				references = {
					refddfve: '21,7 mm',
					refaesq: '15,7 mm',
					refeds: '4,2 mm',
					refedppve: '4,2 mm',
				};
			} else {
				references = {
					refddfve: '26,4 mm',
					refaesq: '19,2 mm',
					refeds: '4,6 mm',
					refedppve: '4,6 mm',
				};
			}
		} else if ( patientAgeYears <= 2 ) {

			references = {
				refddfve: '30,8 mm',
				refaesq: '21,2 mm',
				refeds: '5,6 mm',
				refedppve: '5,4 mm',
			};

		} else if ( patientAgeYears <= 5 ) {

			references = {
				refddfve: '35,9 mm',
				refaesq: '21,0 mm',
				refeds: '5,7 mm',
				refedppve: '6,1 mm',
			};

		} else if ( patientAgeYears <= 10 ) {

			references = {
				refddfve: '39,7 mm',
				refaesq: '23,4 mm',
				refeds: '7,0 mm',
				refedppve: '7,3 mm',
			};

		} else if ( patientAgeYears <= 15 ) {

			references = {
				refddfve: '46,3 mm',
				refaesq: '28,2 mm',
				refeds: '8,8 mm',
				refedppve: '8,8 mm',
			};

		}
	}

	let tabIndex = 0;

	return '<table class="cardio-table">' +
		'<tbody class="cardio-tbody">' +

		'<tr class="cardio-row">' +
		'<td class="cardio-section-cell">Dados do Paciente:</td>' +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Altura:</td>' +
		`<td class="cardio-input-cell" id="altura" tabindex="${++tabIndex}"></td>` +
		'<td class="cardio-unit-cell">cm</td>' +
		'<td class="cardio-ref-input-cell"></td>' +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Peso:</td>' +
		`<td class="cardio-input-cell" id="peso" tabindex="${++tabIndex}"></td>` +
		'<td class="cardio-unit-cell">kg</td>' +
		'<td class="cardio-ref-input-cell"></td>' +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Superfície Corporal:</td>' +
		`<td class="cardio-auto-value-cell" id="sc">${(references['sc'] || '-')}</td>` +
		'<td class="cardio-unit-cell">m²</td>' +
		`<td class="cardio-ref-input-cell"></td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-section-cell">Parâmetros Estruturais:</td>' +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Seios Aórticos:</td>' +
		'<td class="cardio-input-cell" id="sao"></td>' +
		'<td class="cardio-unit-cell">mm</td>' +
		`<td class="cardio-ref-input-cell" id="refsao">${(references['refsao'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Junção Sinotubular:</td>' +
		'<td class="cardio-input-cell" id="jsn"></td>' +
		'<td class="cardio-unit-cell">mm</td>' +
		`<td class="cardio-ref-input-cell" id="refjsn">${(references['refjsn'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Aorta Ascendente:</td>' +
		'<td class="cardio-input-cell" id="aasc"></td>' +
		'<td class="cardio-unit-cell">mm</td>' +
		`<td class="cardio-ref-input-cell" id="refaa">${(references['refaa'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Átrio Esquerdo:</td>' +
		'<td class="cardio-input-cell" id="aesq"></td>' +
		'<td class="cardio-unit-cell">mm</td>' +
		`<td class="cardio-ref-input-cell" id="refaesq">${(references['refaesq'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Volume do Átrio Esquerdo:</td>' +
		'<td class="cardio-input-cell" id="vae"></td>' +
		'<td class="cardio-unit-cell">ml</td>' +
		'<td class="cardio-ref-input-cell"></td>' +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Diâmetro Proximal da Via de Saída do VD:</td>' +
		'<td class="cardio-input-cell" id="dpvsvd"></td>' +
		'<td class="cardio-unit-cell">mm</td>' +
		`<td class="cardio-ref-input-cell" id="refdpvsvd">${(references['refdpvsvd'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Diâmetro Basal do Ventrículo Direito:</td>' +
		'<td class="cardio-input-cell" id="dbvd"></td>' +
		'<td class="cardio-unit-cell">mm</td>' +
		`<td class="cardio-ref-input-cell" id="refdbvd">${(references['refdbvd'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Diâmetro Diastólico Final do VE:</td>' +
		'<td class="cardio-input-cell" id="ddfve"></td>' +
		'<td class="cardio-unit-cell">mm</td>' +
		`<td class="cardio-ref-input-cell" id="refddfve">${(references['refddfve'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Diâmetro Sistólico Final do VE:</td>' +
		'<td class="cardio-input-cell" id="dsfve"></td>' +
		'<td class="cardio-unit-cell">mm</td>' +
		`<td class="cardio-ref-input-cell" id="refdsfve">${(references['refdsfve'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Espessura Diastólica do Septo:</td>' +
		'<td class="cardio-input-cell" id="eds"></td>' +
		'<td class="cardio-unit-cell">mm</td>' +
		`<td class="cardio-ref-input-cell" id="refeds">${(references['refeds'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Espessura Diastólica da PPVE:</td>' +
		'<td class="cardio-input-cell" id="edppve"></td>' +
		'<td class="cardio-unit-cell">mm</td>' +
		`<td class="cardio-ref-input-cell" id="refedppve">${(references['refedppve'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-section-cell">Relações e Funções:</td>' +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Volume do AE / Superfície Corporal:</td>' +
		`<td class="cardio-auto-value-cell" id="vaesc">${(references['vaesc'] || '-')}</td>` +
		'<td class="cardio-unit-cell">ml/m²</td>' +
		`<td class="cardio-ref-input-cell" id="refvaesc">${(references['refvaesc'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Volume Diastólico Final:</td>' +
		'<td class="cardio-input-cell" id="vdf"></td>' +
		'<td class="cardio-unit-cell">ml</td>' +
		`<td class="cardio-ref-input-cell" id="refvdf">${(references['refvdf'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Volume Sistólico Final:</td>' +
		'<td class="cardio-input-cell" id="vsf"></td>' +
		'<td class="cardio-unit-cell">ml</td>' +
		`<td class="cardio-ref-input-cell" id="refvsf">${(references['refvsf'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Volume Diastólico Final / SC:</td>' +
		`<td class="cardio-auto-value-cell" id="vdfsc">${(references['vdfsc'] || '-')}</td>` +
		'<td class="cardio-unit-cell">ml/m²</td>' +
		`<td class="cardio-ref-input-cell" id="refvdfsc">${(references['refvdfsc'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Volume Sistólico Final / SC:</td>' +
		`<td class="cardio-auto-value-cell" id="vsfsc">${(references['vsfsc'] || '-')}</td>` +
		'<td class="cardio-unit-cell">ml/m²</td>' +
		`<td class="cardio-ref-input-cell" id="refvsfsc">${(references['refvsfsc'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Diâmetro Diastólico Final do VE / SC:</td>' +
		`<td class="cardio-auto-value-cell" id="ddfvesc">${(references['ddfvesc'] || '-')}</td>` +
		'<td class="cardio-unit-cell">mm/m²</td>' +
		`<td class="cardio-ref-input-cell" id="refddfvesc">${(references['refddfvesc'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Diâmetro Sistólico Final do VE / SC:</td>' +
		`<td class="cardio-auto-value-cell" id="dsfvesc">${(references['dsfvesc'] || '-')}</td>` +
		'<td class="cardio-unit-cell">mm/m²</td>' +
		`<td class="cardio-ref-input-cell" id="refdsfvesc">${(references['refdsfvesc'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Fração de Ejeção (Simpson):</td>' +
		'<td class="cardio-input-cell" id="fes"></td>' +
		'<td class="cardio-unit-cell">%</</td>' +
		`<td class="cardio-ref-input-cell" id="reffes">${(references['reffes'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Fração de Ejeção:</td>' +
		`<td class="cardio-auto-value-cell" id="fet">${(references['fet'] || '-')}</td>` +
		'<td class="cardio-unit-cell">%</</td>' +
		`<td class="cardio-ref-input-cell" id="reffet">${(references['reffet'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Percent. Encurt. Cavidade:</td>' +
		`<td class="cardio-auto-value-cell" id="pec">${(references['pec'] || '-')}</td>` +
		'<td class="cardio-unit-cell">%</</td>' +
		`<td class="cardio-ref-input-cell" id="refpec">${(references['refpec'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Massa do VE / Superfície Corporal:</td>' +
		`<td class="cardio-auto-value-cell" id="mvesc">${(references['mvesc'] || '-')}</td>` +
		'<td class="cardio-unit-cell">g/m²</</td>' +
		`<td class="cardio-ref-input-cell" id="refmvesc">${(references['refmvesc'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Massa Ventricular Esquerda:</td>' +
		`<td class="cardio-auto-value-cell" id="mve">${(references['mve'] || '-')}</td>` +
		'<td class="cardio-unit-cell">g</</td>' +
		`<td class="cardio-ref-input-cell" id="refmve">${(references['refmve'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Espessura Relativa das Paredes do VE:</td>' +
		`<td class="cardio-auto-value-cell" id="erpve">${(references['erpve'] || '-')}</td>` +
		'<td class="cardio-unit-cell">mm</</td>' +
		`<td class="cardio-ref-input-cell" id="referpve">${(references['referpve'] || '-')}</td>` +
		'</tr>' +

		'<tr class="cardio-row">' +
		'<td class="cardio-label-cell">Relação ERP e Massa VE i:</td>' +
		`<td class="cardio-auto-value-cell" id="rerp">${(references['rerp'] || '-')}</td>` +
		'</tr>' +
		'</tbody>' +
		'</table>';
}

