import { bool, object, string, ref } from 'yup';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const ResValidate = object().shape({
    Email: string().email('Email không hợp lệ').required('Email không bỏ trống'),
    Username: string().required('User Name không được bỏ trống').min(6, 'Tên UserName ít nhất 6 kí tự'),
    Password: string().required('Password không được bỏ trống').min(6, 'Password ít nhất 6 kí tự'),
    // PasswordConfirm: string().oneOf([ref('Password '), null], 'Mật khẩu không khớp'),
    PasswordConfirm: string().required('Không được bỏ trống').test('Mật khẩu không khớp', 'Mật khẩu không khớp', function (value) {
        return this.parent.Password === value
    }),
    Phonemumber: string().matches(phoneRegExp, 'Số điện thoại không hợp lệ').min(10, 'Số điện thoại không hợp lệ').max(10, 'Số điện thoại không hợp')


});
