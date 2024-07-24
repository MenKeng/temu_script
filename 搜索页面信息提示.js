// ==UserScript==
// @name         搜索页面信息提示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Temu搜索页面信息显示,商品ID,商家名称
// @author       menkeng
// @license      GPLv3
// @match        https://www.temu.com/search_result.html*
// @match        https://www.temu.com/*-m-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=temu.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      file://C:/Users/Administrator/Desktop/code/greasy/temu_script/搜索页面信息提示.js
// ==/UserScript==
// @require      https://unpkg.com/dexie/dist/dexie.js
//脚本定制Q:605011383
//脚本定制Q:605011383
//脚本定制Q:605011383
console.log("搜索页面信息提示脚本已启动")
// this.$ = this.jQuery = jQuery.noConflict(true)
var reg_shop_href = /https:\/\/www\.temu\.com\/.*-m-\d{15}.html/
var reg_search_href = /https:\/\/www\.temu\.com\/search_result\.html\?search_key=/
// 自动记录店铺后台id与店铺名称
// 监听 popstate 事件
window.addEventListener("popstate", function (event) {
    checkUrl()
})
window.addEventListener("hashchange", function () {
    checkUrl()
})
window.onload = function () {
    checkUrl()
}

function checkUrl() {
    var url = window.location.href
    // console.log(url)
    // console.log("reg_shop_href", url.match(reg_shop_href))
    // console.log("reg_search_href", url.match(reg_search_href))
    if (reg_shop_href.test(url)) {
        console.log("店铺页面")
        shop_page()
    } else if (reg_search_href.test(url)) {
        console.log("搜索页面")
        search_page()
    }
}

function shop_page() {
    var shopData = localStorage_getstorage("shopData")
    var product_list = document.querySelectorAll("._3wENoqiV .EKDT7a3v")
    var shop_name = document.querySelector("h1").innerText
    product_list.forEach(async (product) => {
        var id_dom = product.querySelectorAll("div")[1]
        var product_id = id_dom.getAttribute("data-tooltip").match(/\d+/)[0]
        addData(shopData, shop_name, product_id)
    })
    localStorage.setItem("shopData", JSON.stringify(shopData))
    console.log("已记录店铺数据", shopData.length, "条记录")
}
function search_page() {
    
}

// ---------------------------------------------------工具类---------------------------------------------------
function localStorage_getstorage(name) {
    var data = localStorage.getItem(name)
    return data ? JSON.parse(data) : {}
}
function addData(storage, key, value) {
    if (!storage[key]) {
        storage[key] = []
    }
    if (!storage[key].includes(value)) {
        storage[key].push(value)
    }
}
// 自动记录搜索关键字

// 搜索页面自动显示id对应的店铺名称
// 多个店铺显示相同的颜色标记

// 手动清空数据按钮
// (可选店铺清空数据按钮)

// 预计增加价格变化曲线,本地存储数据可行性

function getLocalStorageSize() {
    let totalSize = 0

    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            totalSize += localStorage[key].length * 2 // 每个字符占用2个字节
        }
    }
    return totalSize
}

function formatSize(size) {
    if (size < 1024) {
        return size + " B"
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + " KB"
    } else {
        return (size / (1024 * 1024)).toFixed(2) + " MB"
    }
}

const size = getLocalStorageSize()
console.log("LocalStorage 所用容量: " + formatSize(size))
