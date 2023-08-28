// import { errorMapper } from "./utils/ErrorMapper";
import { roleBuilder } from "@/roles/role.builder";
import { roleHarvester } from "@/roles/role.harvester";
import { roleUpgrader } from "@/roles/role.upgrader";
import { createRole } from "@/utils/CreateRole";
import { calcBodyPart } from "@/utils/CreateRole";
import { roleCollector } from "@/roles/role.collector"
import { roleTransporter } from "@/roles/role.transporter";
import {roleRepairer} from "@/roles/role.repairer";
import { Spawn_banner } from "@/structure/spawn";
import { errorMapper } from "@/utils/ErrorMapper";
import { Tower } from "@/structure/tower";
import {roleSigner} from "@/roles/role.signature";
import {roleUndertaker} from "@/roles/role.undertaker";
import {roleExplorer} from "@/roles/role.explorer";
import {roleMiner} from "@/roles/role.miner";
import {roleAttacker} from "@/roles/role.attacker";
import {stateScanner} from "@/utils/GameMemory";
import { StructureManager } from "./utils/RoomMemory";
import {roleClaimer} from "@/roles/role.claimer";
import {roleHelpBuilder} from "@/roles/role.helpbuilder";
import {roleOperator} from "@/roles/role.operator";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
// export const loop = errorMapper(() => {


/**
 * main 函数
 */
export const loop = function () {

    // Get current time
    console.log(`Current game tick is ${Game.time}`);

    // gene Pixel
    if(Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }

    // print Energy
    for(let name in Game.rooms) {
        console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
    }

    // Spawns banner
    Spawn_banner('Spawn1')

    // 房间 Structure 缓存管理
    StructureManager("E15N7")


    // Spawn1 Create screeps
    createRole('harvester',0,calcBodyPart({[MOVE]:1,[WORK]:1,[CARRY]:1}),"Spawn1")
    createRole('collector',2,calcBodyPart({[MOVE]:4,[WORK]:6,[CARRY]:0}),"Spawn1")
    createRole('upgrader',1,calcBodyPart({[MOVE]:2,[WORK]:1,[CARRY]:1}),"Spawn1")
    createRole('builder',0,calcBodyPart({[MOVE]:10,[WORK]:10,[CARRY]:10}),"Spawn1")
    createRole('helpbuilder',1,calcBodyPart({[MOVE]:20,[WORK]:10,[CARRY]:10}),"Spawn1")
    createRole('repairer',1,calcBodyPart({[MOVE]:2,[WORK]:2,[CARRY]:2}),"Spawn1")
    createRole('transporter',4,calcBodyPart({[MOVE]:4,[CARRY]:4}),"Spawn1")
    // createRole('transporter',4,calcBodyPart({[MOVE]:2,[CARRY]:2}),"E15N7")
    createRole('undertaker',1,calcBodyPart({[MOVE]:3,[CARRY]:3}),"Spawn1")
    createRole('signer',0,calcBodyPart({[MOVE]:1}),"Spawn1")
    createRole('explorer',0,calcBodyPart({[MOVE]:1}),"Spawn1")
    createRole('miner',1,calcBodyPart({[MOVE]:3,[WORK]:5,[CARRY]:5}),"Spawn1")
    createRole('attacker',0,calcBodyPart({[MOVE]:20,[ATTACK]:20,[TOUGH]:0}),"Spawn1")
    createRole('claimer',0,calcBodyPart({[MOVE]:1,[CLAIM]:1}),"Spawn1")
    createRole('operator',1,calcBodyPart({[MOVE]:5,[CARRY]:10}),"Spawn1")

    // Spawn2 Create screeps

    // createRole('upgrader',1,calcBodyPart({[MOVE]:2,[WORK]:1,[CARRY]:1}),"Spawn2")
    // createRole('repairer',1,calcBodyPart({[MOVE]:2,[WORK]:2,[CARRY]:2}),"Spawn1")



    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }

    // run role
    for(let name in Game.creeps) {
        const creep = Game.creeps[name];

        //// 运行harvest
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }

        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }

        if (creep.memory.role == 'repairer') {
            roleRepairer.repair(creep);
        }

        if(creep.memory.role == 'upgrader') {
            roleUpgrader.upgrade(creep);
        }

        if(creep.memory.role == 'collector') {
            roleCollector.run(creep);
        }

        if(creep.memory.role == 'transporter') {
            roleTransporter.run(creep);
        }

        if(creep.memory.role == 'signer') {
            roleSigner.run(creep);
        }

        if(creep.memory.role == 'undertaker') {
            roleUndertaker.run(creep);
        }

        if(creep.memory.role == 'explorer') {
            const position = new RoomPosition(25, 25, "E16N8");
            roleExplorer.run(creep,position)
        }

        if (creep.memory.role == 'miner') {
            roleMiner.run(creep)
        }

        if (creep.memory.role == 'attacker') {
            roleAttacker.clearNewRoom(creep,Game.rooms['E16N7'])
        }
        if (creep.memory.role == 'claimer') {
            roleClaimer.claim(creep,Game.rooms['E16N8'])
        }
        // 插旗指定帮助哪里（Flag1）
        if(creep.memory.role == 'helpbuilder') {
            // creep.suicide()
            // const position = new RoomPosition(14, 14, "E16N7");
            // creep.moveTo(position)
            // roleHelpBuilder.build(creep);
            // roleHelpBuilder.repair(creep)
            roleHelpBuilder.upgrade(creep)
        }
        if (creep.memory.role == 'operator') {
            const reactants = {Z:500, energy:200}
            const products = {"zynthium_bar":100}
            roleOperator.runProduction(creep, reactants, products)
            // roleOperator.runChargeNuker(creep)

            //出售订单
            // roleOperator.runTerminal(creep, ORDER_SELL, "zynthium_bar", 346.137, 100000, "E15N7")
            //成交订单 Game.market.deal('64ec1bda3ef8e514dc347fc9', 2500, "E15N7");
            //取消订单 Game.market.cancelOrder("64e658faf7745e5215fa5c60")
        }
    }

    //  run structure
    for (const structureName in Game.rooms["E15N7"].memory.structures) {
        let MemStructure = Game.rooms["E15N7"].memory.structures[structureName]
        if (MemStructure.type == "tower"){
            Tower.run(<Id<StructureTower>>MemStructure.id)
        }
    }

    // 全局资源监控
    stateScanner()

};

