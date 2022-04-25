
# ---- [Lưu ý trước khi build app] ----
//// MỌI NGƯỜI ĐỌC KỸ và SETUP TRƯỚC KHI BUILD APP ////


# 1: FIX react-native-camera để nhận dạng được khuôn mặt người chấm công **(Bắt buộc)**
---------------[ANDROID]------------------
Mở theo đường dẫn sau : 
 -> node_module/react-native-camera/android/src/main/java/org/camera 
Thay thế [RNCameraView.java] [RNCameraViewHelper.java] trong node_module bằng file có sẵn trong thư mục [FileReplace] 
Tiếp sau đó <!--  CŨNG LÀ ĐƯỜNG DÃN ĐÓ  --> mở thư mục event , thay thế [FaceDetectionEvent.java] trong node_module bằng file có sẵn trong thư mục [FileReplace] 
---------------[IOS]------------------
Mở theo đường dẫn sau : 
 -> node_module/react-native-camera/ios/RN 
 Thay thế [RNCamera.m] trong node_module bằng file có sẵn trong thư mục [FileReplace] 
Lưu ý : npm lại không cần chỉnh , khi nào XOÁ node_module thì mới cần CHỈNH lại

# 2: Chỉnh lại PageView thay vì PageViewAndroid nếu có lỗi ( ở android không còn hoạt động được nên phải thay đổi ) - 09/02/2022 Check đã hết lỗi
// -> import ViewPager from '@react-native-community/viewpager' ; thay vì import ViewPageAndroid (View) ở 
// node_modules => react-native-tabs =>react-native-tab-view=> PagerAndroid.js

# 3 : Nếu có lỗi RNPICKER thì nên Erase All máy ảo xong pod install lại là work  

# 4 : Nếu muốn Hide những warning Require cycle do bên Redux thì vào **(optional)**
node_modues/metro/packages/metro/src/lib/polyfills/require.js 
Dòng 117 ->121  Command + / , tắt node run lại là được 



