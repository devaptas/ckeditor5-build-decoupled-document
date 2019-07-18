import CardioEditing from './CardioEditing';
import CardioUI from './CardioUI';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class Cardio extends Plugin {
    static get requires() {
        return [ CardioEditing, CardioUI ];
    }
}
