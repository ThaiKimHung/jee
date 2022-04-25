
import { Dimensions, PixelRatio, Platform } from 'react-native';
import Utils from '../app/Utils';

const { width, height } = Dimensions.get('window');
const aspectRatio = height / width;
export const isPad = aspectRatio <= 1.6;

// Utils.nlog("gia tri PixelRatio ", PixelRatio.get())
let ratioText = isPad ? 1.2 : 1;//PixelRatio.get()//

// Chổ này khi theo dõi trên nhiều thiết bị thì thấy k đúng lắm. --Hoàng
// if (PixelRatio.get() >= 3) {
//   if (Platform.OS == 'android') {
//     ratioText = 1
//   } else {
//     ratioText = 1.1
//   }
// } else if (PixelRatio.get() >= 2.5) {
//   if (Platform.OS == 'android') {
//     ratioText = 0.9
//   } else {
//     ratioText = 1
//   }
// } else if (PixelRatio.get() >= 2) {
//   if (Platform.OS == 'android') {
//     ratioText = 0.8
//   } else {
//     ratioText = 1
//   }
// } else {
//   if (Platform.OS == 'android') {
//     ratioText = 0.8
//   } else {
//     ratioText = 1
//   }
// }

PixelRatio.getFontScale();
let ratioImg = isPad ? 1 : 1;

let so = Platform.OS == 'android' ? 0 : 0

//Dùng để thay đổi kich thước Text tự động trên các thiết bị khác nhau
function reText(size = 14) {
  return size * ratioText + so;
}

//Dùng để thay đổi kich thước: height, with, margin, padding,... tự động trên các thiết bị khác nhau
function reSize(size = 0) {
  return size * ratioImg;
}

let sizes = {
  //font size text
  sText9: 9 * ratioText + so,
  sText8: 8 * ratioText + so,
  sText10: 10 * ratioText + so,
  sText11: 11 * ratioText + so,
  sText12: 12 * ratioText + so,
  sText13: 13 * ratioText + so,
  sText14: 14 * ratioText + so,
  sText15: 15 * ratioText + so,
  sText16: 16 * ratioText + so,
  sText17: 17 * ratioText + so,
  sText18: 18 * ratioText + so,
  sText19: 19 * ratioText + so,
  sText20: 20 * ratioText + so,
  sText22: 22 * ratioText + so,
  sText24: 24 * ratioText + so,
  sText26: 26 * ratioText + so,
  sText27: 27 * ratioText + so,
  sText28: 28 * ratioText + so,
  sText30: 30 * ratioText + so,
  sText32: 32 * ratioText + so,
  sText33: 33 * ratioText + so,
  sText36: 36 * ratioText + so,
  sText54: 54 * ratioText + so,

  //img size
  nImgSize4: 4 * ratioImg,
  nImgSize5: 5 * ratioImg,
  nImgSize6: 6 * ratioImg,
  nImgSize7: 7 * ratioImg,
  nImgSize8: 8 * ratioImg,
  nImgSize9: 9 * ratioImg,
  nImgSize10: 10 * ratioImg,
  nImgSize11: 11 * ratioImg,
  nImgSize12: 12 * ratioImg,
  nImgSize13: 13 * ratioImg,
  nImgSize14: 14 * ratioImg,
  nImgSize15: 15 * ratioImg,
  nImgSize16: 16 * ratioImg,
  nImgSize17: 17 * ratioImg,
  nImgSize18: 18 * ratioImg,
  nImgSize19: 19 * ratioImg,
  nImgSize20: 20 * ratioImg,
  nImgSize21: 21 * ratioImg,
  nImgSize22: 22 * ratioImg,
  nImgSize24: 24 * ratioImg,
  nImgSize25: 25 * ratioImg,
  nImgSize26: 26 * ratioImg,
  nImgSize27: 27 * ratioImg,
  nImgSize28: 28 * ratioImg,
  nImgSize29: 29 * ratioImg,
  nImgSize30: 30 * ratioImg,
  nImgSize31: 31 * ratioImg,
  nImgSize32: 32 * ratioImg,
  nImgSize33: 33 * ratioImg,
  nImgSize35: 35 * ratioImg,
  nImgSize38: 38 * ratioImg,
  nImgSize40: 40 * ratioImg,
  nImgSize44: 44 * ratioImg,
  nImgSize48: 48 * ratioImg,
  nImgSize50: 50 * ratioImg,
  nImgSize56: 56 * ratioImg,
  nImgSize58: 58 * ratioImg,
  nImgSize60: 60 * ratioImg,
  nImgSize63: 63 * ratioImg,
  nImgSize70: 70 * ratioImg,
  nImgSize75: 75 * ratioImg,
  nImgSize80: 80 * ratioImg,
  nImgSize88: 88 * ratioImg,
  nImgSize90: 90 * ratioImg,
  nImgSize94: 94 * ratioImg,
  nImgSize116: 116 * ratioImg,
  nImgSize111: 111 * ratioImg,
  nImgSize120: 120 * ratioImg,
  nImgSize122: 122 * ratioImg,
  nImgSize137: 137 * ratioImg,
  nImgSize187: 187 * ratioImg,
  nImgSize200: 200 * ratioImg,
}

export { sizes, reText, reSize };
