import CardioStressEditing from './CardioStressEditing';
import CardioStressUI from './CardioStressUI';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class CardioStress extends Plugin {
    static get requires() {
        return [ CardioStressEditing, CardioStressUI ];
    }
}
