import Utils from "../app/Utils";

//LayMenuChucNang_App
const apiNotification = `api/menu/LayMenuChucNang?v_module=LandingPage`

async function Get_DSMenu() {
    let res = await Utils.get_api(apiNotification);
    return res;
}

export {
    Get_DSMenu
}