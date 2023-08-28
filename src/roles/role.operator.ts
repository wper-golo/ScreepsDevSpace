
// 计算非重复元素函数
import {Position} from "source-map";
import {Dictionary} from "lodash";
import * as stream from "stream";


// 计算Operator的位置函数
function GetOpPos(creep, factory, terminal, storage) {
    // const factory = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    //     filter: (structure) => {
    //         return (
    //             structure.structureType == STRUCTURE_FACTORY
    //         )
    //     }
    // })
    // const terminal = creep.room.terminal
    // const storage = creep.room.storage
    // const terminal = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    //     filter: (structure) => {
    //         return (
    //             structure.structureType == STRUCTURE_TERMINAL
    //         )
    //     }
    // })
    // const storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    //     filter: (structure) => {
    //         return (
    //             structure.structureType == STRUCTURE_STORAGE
    //         )
    //     }
    // })


    let X: number[] = [];
    let Y: number[] = [];
    X.push(factory.pos.x)
    X.push(terminal.pos.x)
    X.push(storage.pos.x)
    Y.push(factory.pos.y)
    Y.push(terminal.pos.y)
    Y.push(storage.pos.y)

    let OpX = 0
    let OpY = 0

    for (let x of X) {
        OpX += x
    }
    OpX = Math.round(OpX / 3)
    for (let y of Y) {
        OpY += y
    }
    OpY = Math.round(OpY / 3)
    const position = new RoomPosition(OpX, OpY, creep.pos.roomName);
    return position
}

// Operator移动到指定位置
function MoveToOpPos(creep) {
    const factory :StructureFactory = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                structure.structureType == STRUCTURE_FACTORY
            )
        }
    })
    const terminal = creep.room.terminal
    const storage = creep.room.storage
    creep.moveTo(GetOpPos(creep,factory,terminal,storage), {visualizePathStyle: {stroke: '#ffffff'}})
}

export class roleOperator {


    /** @param {Creep} creep **/

    // 生产生成物 eg: Produce(creep,{Z:500, energy:200}, {zynthium_bar:100})
    //Tips: 一定要按公式填写反应物和生成物
    public static runProduction = function (creep: Creep, reactants :Reactant, products :Product) {
        // 移动到指定位置
        MoveToOpPos(creep)

        //factory produce 试运行，看错误码
        
        // const storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        //     filter: (structure) => {
        //         return (
        //             structure.structureType == STRUCTURE_STORAGE
        //         )
        //     }
        // })
        // const factory = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        //     filter: (structure) => {
        //         return (
        //             structure.structureType == STRUCTURE_FACTORY
        //         )
        //     }
        // })

            // 异常状态1：反应物不足
        const product = <CommodityConstant | MineralConstant | RESOURCE_ENERGY | RESOURCE_GHODIUM>Object.keys(products)[0]
        const factory :StructureFactory = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_FACTORY
                )
            }
        })
        const storage = creep.room.storage
        // console.log("DEBUG:",factory.produce(product))
        if (factory.produce(product) == ERR_NOT_ENOUGH_RESOURCES){
            for(let reactant in reactants){
                // factory 存储资源小于需求
                if (factory.store[reactant] < reactants[reactant]){
                    creep.say("OP:pd✋")
                    creep.memory.working = true
                    // Step1 : 检查creep身上是否有资源，有的话丢到工厂里
                    if (storage != null) {
                        for (let res in creep.store){
                            creep.transfer(factory, <ResourceConstant>res)
                        }
                    }
                    // Step2 : creep 按照需求从 storage 取资源
                    creep.withdraw(storage, <"energy" | "power" | "ops" | "U" | "L" | "K" | "Z" | "O" | "H" | "X" | "OH" | "ZK" | "UL" | "G" | "UH" | "UO" | "KH" | "KO" | "LH" | "LO" | "ZH" | "ZO" | "GH" | "GO" | "UH2O" | "UHO2" | "KH2O" | "KHO2" | "LH2O" | "LHO2" | "ZH2O" | "ZHO2" | "GH2O" | "GHO2" | "XUH2O" | "XUHO2" | "XKH2O" | "XKHO2" | "XLH2O" | "XLHO2" | "XZH2O" | "XZHO2" | "XGH2O" | "XGHO2" | "mist" | "biomass" | "metal" | "silicon" | "utrium_bar" | "lemergium_bar" | "zynthium_bar" | "keanium_bar" | "ghodium_melt" | "oxidant" | "reductant" | "purifier" | "battery" | "composite" | "crystal" | "liquid" | "wire" | "switch" | "transistor" | "microchip" | "circuit" | "device" | "cell" | "phlegm" | "tissue" | "muscle" | "organoid" | "organism" | "alloy" | "tube" | "fixtures" | "frame" | "hydraulics" | "machine" | "condensate" | "concentrate" | "extract" | "spirit" | "emanation" | "essence">reactant, (reactants[reactant]-factory.store[reactant]))

                }

            }
        }
        // 正常状态： 成功生产
        if (factory.produce(product) == OK){
            creep.withdraw(factory, <ResourceConstant>product)
            creep.memory.working = false
        }

        if (creep.memory.working == false){
            for (let res in creep.store){
                creep.transfer(storage, <ResourceConstant>res)
            }
        }

        //     // 异常状态2： 工厂满了
        // if (factory.produce(product) == ERR_FULL){
        //     for (let res in factory.store) {
        //         creep.withdraw(factory,res)
        //     }
        // }
        // 第二步 搬运指定数量反应物到factory中

        // 第三步
    }

    //ChargeNuker
    public static runChargeNuker = function (creep: Creep) {
        // 移动到指定位置
        MoveToOpPos(creep)

        // 检测nuker是否需要充能
        const storage = creep.room.storage
        const nuker = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_NUKER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                )
            }
        })
        // 检测storage中的能量是否大于500k，大于则从Storage中取出能量，进行充能
        if (storage.store[RESOURCE_ENERGY] > 500000){
            creep.withdraw(storage, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY))
            creep.transfer(nuker, RESOURCE_ENERGY)
        }
    }

    //Terminal transactions
    public static runTerminal = function (creep: Creep, type: string, resource: ResourceConstant,price: number , amount: number, roomName: string) {
        // 移动到指定位置
        MoveToOpPos(creep)
        // 检测terminal中的资源是否大于指定数量，大于则从terminal中取出指定数量，进行充能
        const terminal = creep.room.terminal
        const storage = creep.room.storage
        creep.say("OP:ts✋")
        //从storage中取出指定数量的资源，放入terminal中
        if (terminal.store[resource] < amount){
            if (creep.store.getFreeCapacity() > 0){
                let surplus = amount - terminal.store[resource]
                let getAmount = creep.store.getFreeCapacity()
                // 先取 总需要量/creep的容量的余数能量 ，如果余数为0 那么就取creep的容量
                if (surplus % getAmount != 0){
                    creep.withdraw(storage, resource, surplus % getAmount)
                }else{
                    creep.withdraw(storage, resource, getAmount)
                }
            }
            creep.transfer(terminal, resource)
        }
        else{
            //console.log 打印订单 Game.market.createOrder({type: <ORDER_BUY | ORDER_SELL>type, resourceType: resource, price: price, totalAmount: amount, roomName: roomName});
            console.log("Game.market.createOrder({type:"+"\""+<ORDER_BUY | ORDER_SELL>type+"\""+" , resourceType: "+"\""+resource+"\""+", price: "+"\""+price+"\""+", totalAmount: "+"\""+amount+"\""+", roomName: "+"\""+roomName+"\""+"});")
        }

    }

}
