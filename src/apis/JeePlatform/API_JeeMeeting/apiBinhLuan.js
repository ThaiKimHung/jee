// https://jeemeeting-api.jee.vn/api/comments/getByComponentName/comment-jeemeeting-155
import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'

const domainJeeMeeting = appConfig.domainJeeMeeting
const apiMetting = 'api/Meeting/'

async function getIdTopic(id) {
    const params = `topicObjectID?IdMeeting=` + id
    let res = await Utils.CallAPI(domainJeeMeeting + apiMetting + params, 'GET')
    return res
}


export {
    getIdTopic
}
