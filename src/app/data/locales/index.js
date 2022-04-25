import { resEN } from './en'
import { resVI } from './vi'
import { appConfig } from '../../Config';
import Utils from '../../Utils';
import changeLanguage from '../../../srcRedux/reducers/changeLanguage';

//-- Định nghĩa các ngôn ngữ 
const langueSuport =
{
    'vi': resVI,
    'en': resEN,

};


const RootLang = {
    lang: resVI,
    _keys: 'vi', //not delete
};

function changeLangue(langue, nthis = undefined) {
    if (langueSuport[langue] == undefined)
        langue = appConfig.defaultLang;
    RootLang.lang = langueSuport[langue];
    RootLang._keys = langue;
    if (nthis) {
        nthis.props.ChangeLanguage(langue);
    }
}

export { RootLang, changeLangue };




