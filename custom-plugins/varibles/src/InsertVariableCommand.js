import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertVariableCommand extends Command {
	execute(value) {
		const editor = this.editor;
		editor.model.change(() => {
			const viewFragment = editor.data.processor.toView(value);
			const modelFragment = editor.data.toModel(viewFragment);
			editor.model.insertContent(modelFragment, editor.model.document.selection);
		});
	}
}

