import { nGlobalKeys } from '../../../app/keys/globalKey';
import Utils from '../../../app/Utils';
import dataSocket from './dataSocket';
import { store } from '../../../srcRedux/store/index';
import { nkey } from '../../../app/keys/keyStore';
import { Message } from './SendMessage'
import dataPresence from './dataPresence';
import dataComment from './dataComment';
const { connection } = dataSocket;
const { connectionPresence } = dataPresence;
const { connectionComment } = dataComment;
var tryingToReconnect = false;

let tempState = 0;
let iLogin = 0;


const initConnection = () => {

  // connection().start().then(() => {
  //   // Utils.nlog("Vô Connect init Message---->", connection())
  // })

  // connectionPresence().start().then(() => {
  //   // Utils.nlog("Vô Connect init Presence---->", connectionPresence())
  // })

  connectionComment().start().then(() => {
    // Utils.nlog("Vô Connect init Comment---->", connectionComment())
  })
}


const stopHubConnection = () => {
  return connection().stop()
}

const sendMessage = async (IdGroup, Content_mess, UserName, Note, IsDelAll = false, IsVideoFile = false, Attachment = [], isInsertMember = false) => {
  var item = new Message()
  item.Content_mess = Content_mess; // Nội dung chat 
  item.UserName = UserName; // UserName
  item.IdGroup = IdGroup; // Group 
  item.Note = Note; /// note
  item.IsDelAll = IsDelAll; /// xoá
  item.IsVideoFile = IsVideoFile; /// Có phải video ko 
  item.Attachment = Attachment; // base 64 
  isInsertMember ? item.isInsertMember = true : null
  Utils.nlog(item)
  let token = await Utils.ngetStorage(nkey.access_token, '');
  // Utils.nlog("=-=-=token", token)
  // Utils.nlog("=-=-=item", item)
  let access_token = "Bearer " + token
  // Utils.nlog(connection())
  return connection().invoke('SendMessage', access_token, item, parseInt(IdGroup)).then(Utils.nlog("Thành công SendMessage")).catch((e) => { Utils.nlog("=-=-=", e) })
}

const sendReaction = async (IdGroup, idchat, type) => {
  let token = await Utils.ngetStorage(nkey.access_token, '');
  let typeNew = parseInt(type)
  // let access_token = "Bearer " + token
  return connection().invoke('ReactionMessage', token, parseInt(IdGroup), idchat, typeNew).then(Utils.nlog("Thành công ReactionMessage")).catch((e) => { Utils.nlog("=-=-=ReactionMessage", e) })
}

const HidenMessage = async (IdChat, IdGroup) => {
  let token = await Utils.ngetStorage(nkey.access_token, '');
  let access_token = "Bearer " + token
  return connection().invoke('DeleteMessage', access_token, IdChat, parseInt(IdGroup)).then(Utils.nlog("==-=Thành công ")).catch(error => Utils.nlog(error));
}
const Composing = async (IdGroup) => {
  let token = await Utils.ngetStorage(nkey.access_token, '');
  let access_token = "Bearer " + token
  return connection().invoke('ComposingMessage', access_token, parseInt(IdGroup)).catch(error => Utils.nlog(error));
}

//chưa làm
const SeenMessage = async (IdGroup, Username) => {
  return connection().invoke('SeenMessage', parseInt(IdGroup), Username).then(Utils.nlog("Thành công SeenMessage")).catch((e) => { Utils.nlog("=-=-=SeenMessage", e) })
}


const ConnectSocket = {
  initConnection,
  sendMessage,
  HidenMessage,
  Composing,
  stopHubConnection,
  sendReaction,
  SeenMessage
};

export default ConnectSocket;
