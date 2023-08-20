import {calcBodyPart, createRole} from "@/utils/CreateRole";
import {HungryTimeCalc, SourceCalc} from "@/utils/RoomMemory";

export function RoleBalance(room:Room) {
    // 计算Spawn 能量紧缺的时间
    HungryTimeCalc(room)
    // 统计房间资源
    if (room.memory.sourceCount == undefined){
        SourceCalc(room)
    }
    // 能量采集角色管理
        //濒危状态
    if (room.memory.HungryTime >= 100){
        createRole('harvester',2,calcBodyPart({[MOVE]:1,[WORK]:1,[CARRY]:1}), room.name)
        createRole('transporter',2,calcBodyPart({[MOVE]:2,[CARRY]:2}), room.name)
    }
        //采运分离
    if (room.controller.level >3){
        createRole('collector',room.memory.sourceCount,calcBodyPart({[MOVE]:4,[WORK]:6}), room.name)
        createRole('transporter',2,calcBodyPart({[MOVE]:2,[CARRY]:2}), room.name)

    }
}
