import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import {addListToDropdown, createDropdown} from "@ckeditor/ckeditor5-ui/src/dropdown/utils";
import Collection from "@ckeditor/ckeditor5-utils/src/collection";
import Model from "@ckeditor/ckeditor5-ui/src/model";
import {getVariables} from "./VariableUtils";
import variableIcon from "../icon/variable.svg";
import listIcon from "../icon/list.svg";
import fixedIcon from '../icon/fixed.svg';
import VariableEditing from './VariableEditing';

export default class VariableUI extends Plugin {

	static get requires() {
        return [
            VariableEditing
        ];
    }

	init() {

		const editor = this.editor;
		const t = editor.t;

		const getVariablesUrl = editor.config.get('getVariablesUrl');
		if (getVariablesUrl) {

			editor.ui.componentFactory.add('variable', locale => {

				const dropdownView = createDropdown(locale);

				// Drop menu para esquerda
				dropdownView.panelPosition = 'sw';

				dropdownView.buttonView.set({
					icon: variableIcon,
					label: t('Variaveis')
				});

				// The collection of the list items.
				const items = new Collection();

				const variables = getVariables(getVariablesUrl);

				variables.forEach((variable) => {
					items.add({
						type: 'button',
						model: new Model({
							icon: variable.is_fixed ? fixedIcon : listIcon,
							label: variable.name,
							withText: true,
							action: 'insertVariable',
							value: variable.value
						}),
					});
				});

				addListToDropdown(dropdownView, items);

				// Commands
				this.listenTo(dropdownView, 'execute', evt => {
					editor.execute(evt.source.action);
				});

				return dropdownView;
			});
		}
	}
}
