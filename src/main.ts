import { errorMapper } from './modules/errorMapper'
import { sayHello } from './modules/utils'

module.exports.loop = errorMapper(() => {
    sayHello()
})