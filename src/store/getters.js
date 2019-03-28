const book = {
    fileName: (state) => {
        return state.book.fileName
    },
    menuVisible: (state) => {
        return state.book.menuVisible
    },
    settingVisible: (state) => {
        return state.book.settingVisible
    },
    defaultFontSize: (state) => {
        return state.book.defaultFontSize
    },
}

export default book;