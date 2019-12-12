import View from '@ckeditor/ckeditor5-ui/src/view';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';

import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler';
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';

import {nextPlaceholder} from "./PlaceholderUtils";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import ListItemView from "@ckeditor/ckeditor5-ui/src/list/listitemview";
import ListView from "@ckeditor/ckeditor5-ui/src/list/listview";

/**
 * The link actions view class. This view displays the link preview, allows
 * unlinking or editing the link.
 *
 * @extends View
 */
export default class PlaceholderOptionsView extends ListView {

	/**
	 * @inheritDoc
	 */
	constructor(editor, data, placeholder) {
		super(editor);

		const t = editor.locale.t;

		this._btnOptions = [];
		this.options = this._createOptions(editor, data, placeholder);

		/**
		 * Tracks information about DOM focus in the actions.
		 *
		 * @readonly
		 * @member {FocusTracker}
		 */
		this.focusTracker = new FocusTracker();

		/**
		 * An instance of the {KeystrokeHandler}.
		 *
		 * @readonly
		 * @member {KeystrokeHandler}
		 */
		this.keystrokes = new KeystrokeHandler();

		/**
		 * A collection of views that can be focused in the view.
		 *
		 * @readonly
		 * @protected
		 * @member {ViewCollection}
		 */
		this._focusables = new ViewCollection();

		/**
		 * Helps cycling over {@link #_focusables} in the view.
		 *
		 * @readonly
		 * @protected
		 * @member {FocusCycler}
		 */

		this._focusCycler = new FocusCycler({
			focusables: this._focusables,
			focusTracker: this.focusTracker,
			keystrokeHandler: this.keystrokes,
			actions: {
				// Navigate fields backwards using the arrowUp keystroke.
				focusPrevious: 'arrowdown',
				// Navigate fields forwards using the arrowDown key.
				focusNext: 'arrowup'
			}
		});

		this.setTemplate({
			tag: 'ul',
			attributes: {
				class: 'ck-list placeholder-option-ul',
				tabindex: '-1'
			},
			children: this.options
		});

	}

	/**
	 * @inheritDoc
	 */
	render() {
		super.render();

		this._btnOptions.forEach(v => {

			// Register the view as focusable.
			this._focusables.add(v);

			// Register the view in the focus tracker.
			this.focusTracker.add(v.element);
		});

		// Start listening for the keystrokes coming from #element.
		this.keystrokes.listenTo(this.element);
	}

	/**
	 * Focuses the fist {@link #_focusables} in the actions.
	 */
	focus() {
		this._focusCycler.focusFirst();
	}

	_createOptions(editor, data, placeholder) {
		const element = data.domTarget;
		const target = data.target;
		let liOptions = [];
		JSON.parse(element.dataset.options).forEach((option) => {

			const btnView = new ButtonView(editor.locale);
			btnView.set( {
				label: option,
				withText: true,
				class: 'placeholder-option-btn',
				tooltip: false
			});
			btnView.on('execute', () => {
				const modelElement = editor.editing.mapper.toModelElement(target);
				editor.model.change(writer => {
					writer.setAttributes({
						isSolved: 1,
						value: option
					}, modelElement);
					editor.editing.view.focus();

					// Encontra proxima variavel
					if (!nextPlaceholder(editor)) {
						placeholder.closeBalloon();
					}
				});
			});

			const liView = new ListItemView(editor.locale);
			liView.children.add( btnView );

			this._btnOptions.push(btnView);
			liOptions.push(liView);
		});

		return liOptions;
	}
}
