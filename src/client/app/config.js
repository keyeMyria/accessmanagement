const DOMAIN_PATH = 'http://localhost:4000/graphql';
let remote = 'http://192.168.1.2:4000/graphql';
let remote_upload = 'http://192.168.1.2:4000/upload';
let local_upload_import = 'http://192.168.1.2:4000/importUserList';
let websocket_endpoint ='ws://192.168.1.2:4000/subscriptions';

export const LOCAL_WEBSOCKET_ENDPOINT = websocket_endpoint;
export default DOMAIN_PATH;
export const REMOTE_DOMAIN_PATH = remote;
export const REMOTE_UPLOAD_PATH = remote_upload;
export const LOCAL_IMPORT_PATH = local_upload_import;
