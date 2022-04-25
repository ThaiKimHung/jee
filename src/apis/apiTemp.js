
import Utils from "../app/Utils";


const apiFeedBugs = `api/controllergeneral/postThongBaoLoi?content=`
async function SendFeedBackorBugs(content) {
    let res = await Utils.get_api(apiFeedBugs + content);
    return res;
}

export {
    SendFeedBackorBugs
}