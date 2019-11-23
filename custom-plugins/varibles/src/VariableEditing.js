import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import InsertVariableCommand from './InsertVariableCommand';

export default class VariableEditing extends Plugin {

	static get requires() {
		return [Widget];
	}

	init() {
		this.editor.commands.add('insertVariable', new InsertVariableCommand(this.editor));
	}
}

