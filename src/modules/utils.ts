/**
 * 显示 hello world
 */
export const sayHello = function () {
    console.log('hello world')
    throw new Error('我是 sayHello 里的报错')
}