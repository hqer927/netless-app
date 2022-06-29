/* eslint-disable @typescript-eslint/no-explicit-any */
import '@netless/window-manager/dist/style.css';
import './index.css';
import '../../src/style.scss';
import { WhiteWebSdk, DeviceType, DefaultHotKeys, HotKeyEvent, KeyboardKind} from "white-web-sdk";
import { WindowManager } from "@netless/window-manager";
import SlideApp, { addHooks } from "../../src";

const elm = document.getElementById('whiteboard') as HTMLDivElement;
const appIdentifier = '123456789/987654321';
const ctrlShiftHotKeyCheckerWith = (k:string) =>{
    return (event: HotKeyEvent, kind: KeyboardKind) => {
        const { key, altKey, ctrlKey, shiftKey, nativeEvent } = event;
        switch (kind) {
            case KeyboardKind.Mac: {
                return (
                    key === k &&
                    !ctrlKey &&
                    !altKey &&
                    shiftKey &&
                    !!nativeEvent?.metaKey
                );
            }
            case KeyboardKind.Windows: {
                return (
                    key === k &&
                    ctrlKey &&
                    !altKey &&
                    shiftKey &&
                    event.kind === "KeyDown"
                );
            }
            default: {
                return false;
            }
        }
    };

}
const whiteWebSdk = new WhiteWebSdk({
    appIdentifier,
    useMobXState: true,
    deviceType: DeviceType.Surface,
    // apiHosts: [
    //     "api-cn-hz.netless.group",
    // ],
})
const sUid = sessionStorage.getItem('uid');
const isWritable = !!(sUid && sUid.indexOf('1234') > 0);
const uid = sUid || 'uid-' + Math.floor(Math.random() * 10000);
if (!sUid) {
    sessionStorage.setItem('uid', uid); 
}
const room = await whiteWebSdk.joinRoom({
    uuid:"878419c0976411ef83863d0682a6c9bd",
    roomToken:"NETLESSROOM_YWs9VWtNUk92M1JIN2I2Z284dCZleHBpcmVBdD0xNzMwNDUwNzQ5OTI2Jm5vbmNlPTg3OTkyODYwLTk3NjQtMTFlZi05NmE5LWFiMzg4NjE4OThhZiZyb2xlPTEmc2lnPWViNGVhZWVkYWIxZGFiZWRmNTU0NzYxMTI5MTQxODhlMTYwYzljNDU2NTYzODkwMzM4NjY5ZmI3YjdjMzI1NDImdXVpZD04Nzg0MTljMDk3NjQxMWVmODM4NjNkMDY4MmE2YzliZA",
    uid,
    region: "cn-hz",
    isWritable: isWritable,
    floatBar: true,
    userPayload: {
        // userId: uid.split('uid-')[1],
        // userUUID: uid,
        // cursorName: `user-${uid}`,
        nickName: isWritable ? `teacher-${uid}` : `studenr-${uid}`,
    },
    hotKeys: {
        ...DefaultHotKeys,
        redo: ctrlShiftHotKeyCheckerWith("z"),
        changeToSelector: "s",
        changeToLaserPointer: "z",
        changeToPencil: "p",
        changeToRectangle: "r",
        changeToEllipse: "c",
        changeToEraser: "e",
        changeToText: "t",
        changeToStraight: "l",
        changeToArrow: "a",
        changeToHand: "h",
    },
    invisiblePlugins: [WindowManager as any],
    disableNewPencil: false,
    useMultiViews: true, 
})
if (room.isWritable) {
    room.setScenePath("/init");
}
WindowManager.register({
    kind: "Slide",
    appOptions: { debug: false },
    src: SlideApp,
    addHooks,
});
  
const manager = await WindowManager.mount({ room , container:elm, chessboard: true, cursor: true});
if (manager) {
    if (isWritable) {
        room.disableSerialization = false;
    }
}
window.manager = manager;
document.getElementById('addBtn')?.addEventListener('click', () => {
    const taskId = '82d16c40b15745f0b5fad096ac721773';
    window.manager.addApp({
        kind: "Slide",
        options: {
            scenePath: `/ppt/${taskId}`, // [1]
            title: "test.pptx",
        },
        attributes: {
            taskId, // [2]
            url: "https://convertcdn.netless.link/dynamicConvert", // [3]
        }
        // mutualPlugin: window.appliancePlugin
    });
    
});