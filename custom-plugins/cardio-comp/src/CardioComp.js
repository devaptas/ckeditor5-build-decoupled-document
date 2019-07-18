import CardioCompEditing from './CardioCompEditing';
import CardioCompUI from './CardioCompUI';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class CardioComp extends Plugin {
    static get requires() {
        return [ CardioCompEditing, CardioCompUI ];
    }
}
