import PageBreakEditing from './PageBreakEditing';
import PageBreakUI from './PageBreakUI';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class PageBreak extends Plugin {
    static get requires() {
        return [PageBreakEditing, PageBreakUI];
    }
}
