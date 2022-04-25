import moment from "moment";
//Hàm quy tắc hiển thị nội dung theo tài liệu
//============================Thời gian rút gọn có hiển thị giờ==================================================
export function case_priority_1_istime(daynum, date_value, date_now, langcode) {
    let date = '';
    if (daynum > 1) {//Sau hiện tại hơn 1 ngày
        if (date_value.getFullYear() == date_now.getFullYear()) {
            if (langcode == "vi") {
                // date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                date = moment(date_value).locale(langcode).format('DD MMM'); //31 Thg 10 
            } else {
                // date = moment(date_value).format('MMM d');
                date = moment(date_value).locale(langcode).format('MMM DD'); //Oct 31
            }
        } else {
            if (langcode == "vi") {
                date = moment(date_value).format('DD/MM/YYYY');//20/05/2050
            } else {
                date = moment(date_value).format('MM/DD/YYYY');//05/20/2050
            }
        }
    } else if (daynum == 1) {//Sau hiện tại 1 ngày
        if (langcode == "vi") {
            date = moment(date_value).format('HH:mm') + " ngày mai";
        } else {
            date = moment(date_value).format('HH:mm') + " tomorrow";
        }
    } else if (daynum == 0) {//Ngày hiện tại
        if (langcode == "vi") {
            date = moment(date_value).format('HH:mm') + " hôm nay";
        } else {
            date = moment(date_value).format('HH:mm') + " today";
        }
    } else if (daynum == -1) {//Trước hiện tại 1 ngày
        if (langcode == "vi") {
            date = moment(date_value).format('HH:mm') + " hôm qua";
        } else {
            date = moment(date_value).format('HH:mm') + " yesterday";
        }
    } else if (daynum > -8) {//Trước hiện tại dưới 8 ngày
        if (langcode == "vi") {
            date = Math.abs(daynum) + " ngày trước";
        } else {
            date = Math.abs(daynum) + " days ago";
        }
    }
    else {//Trước hiện tại từ 8 ngày trở lên
        if (date_value.getFullYear() == date_now.getFullYear()) {
            if (langcode == "vi") {
                // date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                date = moment(date_value).locale(langcode).format('DD MMM'); //31 Thg 10 
            } else {
                // date = moment(date_value).format('MMM d');
                date = moment(date_value).locale(langcode).format('MMM DD'); //Oct 31
            }
        } else {
            if (langcode == "vi") {
                date = moment(date_value).format('DD/MM/YYYY');//20/05/2050
            } else {
                date = moment(date_value).format('MM/DD/YYYY');//05/20/2050
            }
        }
    }
    return date;
}

//=======================Thời gian rút gọn không có hiển thị giờ==================================
export function case_priority_1_notistime(daynum, date_value, date_now, langcode) {
    let date = '';
    if (daynum > 1) {//Sau hiện tại hơn 1 ngày
        if (date_value.getFullYear() == date_now.getFullYear()) {
            if (langcode == "vi") {
                // date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                date = moment(date_value).locale(langcode).format('DD MMM'); //31 Thg 10 
            } else {
                date = moment(date_value).locale(langcode).format('MMM DD'); //Oct 31
            }
        } else {
            if (langcode == "vi") {
                date = moment(date_value).format('DD/MM/YYYY');//20/05/2050
            } else {
                date = moment(date_value).format('MM/DD/YYYY');//05/20/2050
            }
        }
    } else if (daynum == 1) {//Sau hiện tại 1 ngày
        if (langcode == "vi") {
            date = "Ngày mai";
        } else {
            date = "Tomorrow";
        }
    } else if (daynum == 0) {//Ngày hiện tại
        if (langcode == "vi") {
            date = moment(date_value).format('HH:mm');//Hôm nay
        } else {
            date = moment(date_value).format('HH:mm');//Today
        }
    } else if (daynum == -1) {//Trước hiện tại 1 ngày
        if (langcode == "vi") {
            date = "Hôm qua";
        } else {
            date = "Yesterday";
        }
    } else if (daynum > -8) {//Trước hiện tại dưới 8 ngày
        if (langcode == "vi") {
            date = Math.abs(daynum) + " ngày trước";
        } else {
            date = Math.abs(daynum) + " days ago";
        }
    } else {//Trước hiện tại từ 8 ngày trở lên
        if (date_value.getFullYear() == date_now.getFullYear()) {
            if (langcode == "vi") {
                // date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                date = moment(date_value).locale(langcode).format('DD MMM'); //31 Thg 10 
            } else {
                // date = moment(date_value).format('MMM d');
                date = moment(date_value).locale(langcode).format('MMM DD'); //Oct 31
            }
        } else {
            if (langcode == "vi") {
                date = moment(date_value).format('DD/MM/YYYY');//20/05/2050
            } else {
                date = moment(date_value).format('MM/DD/YYYY');//05/20/2050
            }
        }
    }
    return date;
}
//============================Thời gian đầy đủ có hiển thị giờ==================================================
export function case_priority_0_istime(daynum, date_value, date_now, langcode) {
    let date = '';
    if (daynum > 1) {//Sau hiện tại hơn 1 ngày
        if (langcode == "vi") {
            date = inHoaChuDau(moment(date_value).locale(langcode).format('dddd, DD/MM/YYYY HH:mm')); //Thứ ba 20/10/2020 00:00
        } else {
            date = moment(date_value).locale(langcode).format('dddd, MM/DD/YYYY HH:mm');//Tuesday 10/20/2020 00:00
        }
    } else if (daynum == 1) {//Sau hiện tại 1 ngày
        if (langcode == "vi") {
            date = moment(date_value).format('HH:mm') + " ngày mai";
        } else {
            date = moment(date_value).format('HH:mm') + " tomorrow";
        }
    } else if (daynum == 0) {//Ngày hiện tại
        date = moment(date_value).format('HH:mm')
    } else if (daynum == -1) {//Trước hiện tại 1 ngày
        if (langcode == "vi") {
            date = moment(date_value).format('HH:mm') + " hôm qua";
        } else {
            date = moment(date_value).format('HH:mm') + " yesterday";
        }
    } else {//Trước hiện tại trên 1 ngày
        if (langcode == "vi") {
            date = inHoaChuDau(moment(date_value).locale(langcode).format('dddd, DD/MM/YYYY HH:mm'));//Thứ ba 20/10/2020 00:00
        } else {
            date = moment(date_value).locale(langcode).format('dddd, MM/DD/YYYY HH:mm');//Tuesday 10/20/2020 00:00
        }
    }
    return date;
}

//=======================Thời gian đầy đủ không có hiển thị giờ==================================
export function case_priority_0_notistime(daynum, date_value, date_now, langcode) {
    let date = '';
    if (daynum > 1) {//Sau hiện tại hơn 1 ngày
        if (date_value.getFullYear() == date_now.getFullYear()) {
            if (langcode == "vi") {
                date = moment(date_value).locale(langcode).format('DD MMM'); //31 Thg 10 
            } else {
                date = moment(date_value).locale(langcode).format('MMM DD'); //Oct 31
            }
        } else {
            if (langcode == "vi") {
                date = moment(date_value).locale(langcode).format('DD MMM, YYYY'); //31 Thg 10, 2020 
            } else {
                date = moment(date_value).locale(langcode).format('MMM DD, YYYY'); //Oct 31, 2020 
            }
        }
    } else if (daynum == 1) {//Sau hiện tại 1 ngày
        if (langcode == "vi") {
            date = "Ngày mai";
        } else {
            date = "Tomorrow";
        }
    } else if (daynum == 0) {//Ngày hiện tại
        if (langcode == "vi") {
            date = "Hôm nay";
        } else {
            date = "Today";
        }
    } else if (daynum == -1) {//Trước hiện tại 1 ngày
        if (langcode == "vi") {
            date = "Hôm qua";
        } else {
            date = "Yesterday";
        }
    } else if (daynum > -8) {//Trước hiện tại dưới 8 ngày
        if (langcode == "vi") {
            date = Math.abs(daynum) + " ngày trước";
        } else {
            date = Math.abs(daynum) + " days ago";
        }
    } else {//Trước hiện tại từ 8 ngày trở lên
        if (date_value.getFullYear() == date_now.getFullYear()) {
            if (langcode == "vi") {
                date = moment(date_value).locale(langcode).format('DD MMM'); //31 Thg 10 
            } else {
                date = moment(date_value).locale(langcode).format('MMM DD'); //Oct 31
            }
        } else {
            if (langcode == "vi") {
                date = moment(date_value).locale(langcode).format('DD MMM, YYYY'); //31 Thg 10, 2020
            } else {
                date = moment(date_value).locale(langcode).format('MMM DD, YYYY'); //Oct 31, 2020 
            }
        }
    }
    return date;
}
//------Đếm thời gian-------
export function case_priority_3_istime(daynum, date_value, date_now, langcode) {
    let date = '';
    let time = moment(date_value).format("HH:mm")
    if (daynum > 1) { //Sau hiện tại hơn 1 ngày
        if (langcode == "vi") {
            date = Math.abs(daynum) + " ngày sau"
        } else {
            date = Math.abs(daynum) + " next day"
        }
    } else if (daynum == 1) {//Sau hiện tại 1 ngày
        if (langcode == "vi") {
            date = "Ngày mai"
        } else {
            date = "Tomorrow";
        }
    } else if (daynum == 0) {//Ngày hiện tại
        if (langcode == "vi") {
            date = time + " Hôm nay";
        } else {
            date = time + " Today";
        }
    } else if (daynum == -1) {//Trước hiện tại 1 ngày
        if (langcode == "vi") {
            date = "Hôm qua";
        } else {
            date = "Yesterday";
        }
    } else if (daynum < -1) {//Trước hiện tại hơn 1 ngày
        if (langcode == "vi") {
            date = Math.abs(daynum) + " ngày trước";
        } else {
            date = Math.abs(daynum) + " days ago";
        }
    }
    return date;
}
//=====================Đổi chữ cái đầu tiên của thứ thành IN HOA===========
function inHoaChuDau(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
//=====================Đổi tiếng anh qua tiếng việt nếu là thứ ngày===========
export function f_date_thu(value) {
    let e = moment(value).format('dddd');
    let latest_date = moment(value).format('dddd, dd/MM/yyy HH:mm');
    switch (e) {
        case "Monday":
            latest_date = latest_date.replace("Monday", "Thứ hai");
            break;
        case "Tuesday":
            latest_date = latest_date.replace("Tuesday", "Thứ ba");
            break;
        case "Wednesday":
            latest_date = latest_date.replace("Wednesday", "Thứ tư");
            break;
        case "Thursday":
            latest_date = latest_date.replace("Thursday", "Thứ năm");
            break;
        case "Friday":
            latest_date = latest_date.replace("Friday", "Thứ sáu");
            break;
        case "Saturday":
            latest_date = latest_date.replace("Saturday", "Thứ bảy");
            break;
        default:
            latest_date = latest_date.replace("Sunday", "Chủ nhật");
            break;
    }
    return latest_date;
}
