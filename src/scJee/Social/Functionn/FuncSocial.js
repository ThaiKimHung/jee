import { RootLang } from '../../../app/data/locales';

function Title_Emoji(idLike) {
    switch (idLike) {
        case 1: return RootLang.lang.JeeSocial.like;
        case 2: return RootLang.lang.JeeSocial.yeuthich;
        case 3: return RootLang.lang.JeeSocial.haha;
        case 4: return RootLang.lang.JeeSocial.wow;
        case 5: return RootLang.lang.JeeSocial.buon;
        case 6: return RootLang.lang.JeeSocial.thuongthuong;
        case 7: return RootLang.lang.JeeSocial.phanno;
        default: return RootLang.lang.JeeSocial.like;
    }
}

function Title_Emoji_Comment(title) {
    switch (title) {
        case 'Like': return RootLang.lang.JeeSocial.like;
        case 'Love': return RootLang.lang.JeeSocial.yeuthich;
        case 'Haha': return RootLang.lang.JeeSocial.haha;
        case 'Wow': return RootLang.lang.JeeSocial.wow;
        case 'Sad': return RootLang.lang.JeeSocial.buon;
        case 'Care': return RootLang.lang.JeeSocial.thuongthuong;
        case 'Angry': return RootLang.lang.JeeSocial.phanno;
        default: return RootLang.lang.JeeSocial.like;
    }
}


export default {
    Title_Emoji, Title_Emoji_Comment
};

