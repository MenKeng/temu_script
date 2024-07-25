// ==UserScript==
// @name         Temu显示店铺信息
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Temu搜索页面信息显示,商品ID,商家名称
// @author       menkeng
// @license      GPLv3
// @match        https://www.temu.com/search_result.html*
// @match        https://www.temu.com/*-m-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=temu.com
// ==/UserScript==
// @require      https://unpkg.com/dexie/dist/dexie.js
//脚本定制Q:605011383
//脚本定制Q:605011383
//脚本定制Q:605011383
// this.$ = this.jQuery = jQuery.noConflict(true)
var reg_shop_href = /https:\/\/www\.temu\.com\/.*-m-\d{15}.html/
var reg_search_href = /https:\/\/www\.temu\.com\/search_result\.html\?search_key=/
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
    if (reg_shop_href.test(url)) {
        console.log("店铺页面")
        shop_page()
    } else if (reg_search_href.test(url)) {
        console.log("搜索页面")
        search_page()
    }
}
var shop_count = {}; // 用于存储店铺计数的对象
function shop_page() {
    var shopData = localStorage_getStorage("shopData")
    var product_list = document.querySelectorAll("._3wENoqiV .EKDT7a3v")
    var shop_name = document.querySelector("h1").innerText
    product_list.forEach(async (product) => {
        var id_dom = product.querySelectorAll("div")[1]
        var product_id = id_dom.getAttribute("data-tooltip").match(/\d+/)[0]
        addData(shopData, shop_name, product_id)
    })
    localStorage.setItem("shopData", JSON.stringify(shopData))
    console.log("已记录店铺数据")
}
async function search_page() {
    var item_count = 0
    var product_list = document.querySelectorAll(".EKDT7a3v")
    var shop_data = localStorage_getStorage("shopData")
    product_list.forEach(async (product) => {
        item_count++
        if (item_count > 12) {
            await sleep(item_count*10)
        }
        var id_dom = product.querySelectorAll("div")[1]
        var id = id_dom.getAttribute("data-tooltip").match(/\d+/)[0]
        var shop_name = findKeyByName(shop_data, id)

        if (!shop_count[shop_name]) {
            shop_count[shop_name] = 0;
        }
        shop_count[shop_name]++;
        updateShopCountDisplay(shop_count)

        var button = document.createElement("button")
        button.innerText = shop_name
        button.classList.add("shop_name")
        button.id = shop_name
        button.style.backgroundColor = "rgba(255, 255, 255, 0.2)"
        button.style.cssText = "padding: 10px 15px; border: none; cursor: pointer;z-index: 99999;color:black"
        button.onclick = function () {
            event.stopPropagation()
        }
        id_dom.appendChild(button)
    })
}
function updateShopCountDisplay(shop_count) {
    var shopCountContainer = document.querySelector(".shop-count-container");
    if (!shopCountContainer) {
        shopCountContainer = document.createElement("div");
        shopCountContainer.classList.add("shop-count-container");
        shopCountContainer.style.cssText = "position: fixed; top: 0; right: 0; background-color: white; padding: 10px; z-index: 100000;";
        document.body.appendChild(shopCountContainer);
    }

    // 清空现有内容
    shopCountContainer.innerHTML = "";

    // 更新店铺计数显示
    for (var shop_name in shop_count) {
        var shopCountElement = document.createElement("div");
        shopCountElement.innerText = `${shop_name}: ${shop_count[shop_name]}`;
        shopCountContainer.appendChild(shopCountElement);
    }
}
// ---------------------------------------------------工具类---------------------------------------------------
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
function localStorage_getStorage(name) {
    var data = localStorage.getItem(name)
    return data ? JSON.parse(data) : {}
}
// 创建反向映射
function createReverseMap(data) {
    const reverseMap = new Map()
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            data[key].forEach((item) => {
                reverseMap.set(item, key)
            })
        }
    }
    return reverseMap
}

function findKeyByItem(reverseMap, itemToFind) {
    return reverseMap.get(itemToFind) || null
}

function findKeyByName(data, itemToFind) {
    const reverseMap = createReverseMap(data)
    return findKeyByItem(reverseMap, itemToFind)
}
function addData(storage, key, value) {
    if (!storage[key]) {
        storage[key] = []
    }
    if (!storage[key].includes(value)) {
        storage[key].push(value)
    }
}
// upgrade
// 自动记录搜索关键字


// 手动清空数据按钮
// (可选店铺清空数据按钮)

// 预计增加价格变化曲线