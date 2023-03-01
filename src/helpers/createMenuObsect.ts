type MenuOption = '' | 'home' | 'classificador'

export const creatMenuObject = (activeMenu: MenuOption) => {
    let returnObject = {
        home: false,
        classificador: false
    }

    if(activeMenu != ''){
        returnObject[activeMenu] = true
    }

    return returnObject
}