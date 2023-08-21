/*
  Example types, expand on these or remove them and add your own.
  Note: Values, properties defined here do no fully *exist* by this type definiton alone.
        You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

  Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
  Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
*/
// Memory extension samples
interface Memory {
    uuid?: number;
    log?: any;
    stats?:{
        gcl?: number
        gclLevel?: number
        gpl?: number
        gplLevel?: number
        cpu?:number
        bucket?:number
    }
}

interface CreepMemory {
    role: string;
    room?: string;
    working?: boolean;
    dst?: Id<_HasId>; // source.id
    repaired?: boolean; // For collector repair container
    repairing?: boolean; // For builder repair
    capacity?: number // creep's capacity
    target_id?: string // target is that creep work for what

}

// Syntax for adding proprties to `global` (ex "global.log")
interface Global {
    log: any;
}

interface BodySet {
    [MOVE]?: number
    [CARRY]?: number
    [ATTACK]?: number
    [RANGED_ATTACK]?: number
    [WORK]?: number
    [CLAIM]?: number
    [TOUGH]?: number
    [HEAL]?: number
}

interface RoomMemory {
    sourceCache :{
        string? : boolean // false: idle  |  true: occupy
    }
    FullyEnergy ?:boolean // 房间是否充满资源
    HungryTime ?:number  // Spawn 能量缺少时间
    sourceCount ?: number // 能量矿的数量
    EnergyAvailable ?: number // spawn 可用的能量数
    lastScanTime ?: number
    structures?:{
        [StructureName:string]:{
            type?: string;
            // room?: string;
            id?: string;
            need_repaired?: boolean; // 不同的建筑有不同的repaire需求 ，用于标志是否需要被修复
            repairing?: boolean; // 判断是否正在被修复
        }

    }

}

// Factory 反应物 接口
interface Reactant {
    // eg: RESOURCE_ENERGY : 100
    [key: string]: number
    // // 基础商品
    // [RESOURCE_ENERGY]?: number
    // [RESOURCE_UTRIUM]?: number
    // [RESOURCE_LEMERGIUM]?: number
    // [RESOURCE_ZYNTHIUM]?: number
    // [RESOURCE_KEANIUM]?: number
    // [RESOURCE_GHODIUM]?: number
    // [RESOURCE_OXYGEN]?: number
    // [RESOURCE_HYDROGEN]?: number
    // [RESOURCE_CATALYST]?: number
    // [RESOURCE_UTRIUM_BAR]?: number
    // [RESOURCE_LEMERGIUM_BAR]?: number
    // [RESOURCE_ZYNTHIUM_BAR]?: number
    // [RESOURCE_KEANIUM_BAR]?: number
    // [RESOURCE_GHODIUM_MELT]?: number
    // [RESOURCE_OXIDANT]?: number
    // [RESOURCE_REDUCTANT]?: number
    // [RESOURCE_PURIFIER]?: number
    // [RESOURCE_BATTERY]?: number
    // [RESOURCE_SILICON]?: number
    // [RESOURCE_BIOMASS]?: number
    // [RESOURCE_METAL]?: number
    // [RESOURCE_MIST]?: number
    // //高级商品 还没写

}

// Factory 生成物 接口
// interface Product {
//     // eg: RESOURCE_ZYNTHIUM_BAR : 100
//     [key: string]: number
// }
interface Product {
    // eg: RESOURCE_ZYNTHIUM_BAR : 100
    [key:string]: number
}