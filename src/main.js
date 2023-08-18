import { errorMapper } from './modules/errorMapper'
import { sayHello } from './modules/utils'

export const loop = errorMapper(() => {
    sayHello()
})