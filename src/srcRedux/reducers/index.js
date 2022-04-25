import { combineReducers } from 'redux';
import counterReducer from './counterReducer';
import loadCTChamCong from './loadCTChamCong';
import changeLanguage from './changeLanguage';
import shownotification from './shownotification';
import LoadTangCa from './loadTangCa';
import loadThongTinUser from './loadThongTinUser';
import GetMenuApp from './menuApp';
import DuyetDonReducer from './reducerDuyetDon';
import BangCongReducer from './reducerBangCong';
import DKPhepReducer from './reducerDKPhep'
import hideCamera from './hideCamera'
import reducerThongBao from './reducerThongBao';
import reducerThongBaoChat from './reducerThongBaoChat'
import RootReducerChat from '../../scJee/Chat/redux/reducer';
import countWork, { countProceduralWork } from './countWork'
import countWorkChild from './countWorkChild'
import countCVTuan, { countCVThang } from './countCongViecLapLai'

export default combineReducers({
  counter: counterReducer,
  dsCTCong: loadCTChamCong,
  changeLanguage: changeLanguage,
  Notifi: shownotification,
  LoadTC: LoadTangCa,
  stateUser: loadThongTinUser,
  GetMenuApp: GetMenuApp,
  DuyetDonReducer: DuyetDonReducer,
  reducerBangCong: BangCongReducer,
  DKPhepReducer: DKPhepReducer,
  hideCamera: hideCamera,
  ThongBao: reducerThongBao,
  ThongBaoChat: reducerThongBaoChat,
  CountWork: countWork,
  CountProceduralWork: countProceduralWork,
  CountWorkChild: countWorkChild,
  CountCVTuan: countCVTuan,
  CountCVThang: countCVThang,
  ...RootReducerChat,

});