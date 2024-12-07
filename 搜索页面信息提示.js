// ==UserScript==
// @name         Temu显示店铺信息
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Temu搜索页面信息显示,商品ID,商家名称
// @author       menkeng
// @license      GPLv3
// @match        https://www.temu.com/search_result.html*
// @match        https://www.temu.com/*-m-*
// @match        https://www.temu.com/*page_name=category*
// @match        https://www.temu.com/search_result.html?search_key*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=temu.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// ==/UserScript==
//脚本定制Q:605011383
//脚本定制Q:605011383
//脚本定制Q:605011383
//脚本定制Q:605011383
// this.$ = this.jQuery = jQuery.noConflict(true)
console.log("Temu显示店铺信息已加载")
var shop_count = {}
var reg_shop_href = /www.temu.com\/.*-m-\d{13}/
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
GM_registerMenuCommand("清除商品数据", function () {
    localStorage.removeItem("shopData")
})
function checkUrl() {
    var url = window.location.href
    if (reg_shop_href.test(url)) {
        console.log("店铺页面")
        shop_page()
    } else if (reg_search_href.test(url)) {
        console.log("搜索页面")
        setTimeout(() => {
            search_page()
        }, 2000)
    } else if (url.includes("category")) {
        console.log("分类页面")
        setTimeout(() => {
            search_page()
        }, 2000)
    } else {
        pass
    }
}

function shop_page() {
    var more = $("span:contains('See more')")
    more.length > 1 ? more[0].click() : null
    var product_list_inner
    var shopData = tool.localStorage_getStorage("shopData")
    var product_list = document.querySelectorAll("._3wENoqiV .goods-image-container-external")
    var shop_name = document.querySelector("h1").innerText
    product_list.forEach(async (product) => {
        var product_id = product.getAttribute("data-tooltip").match(/\d+/)[0]
        tool.addData(shopData, shop_name, product_id)
    })
    if (document.querySelectorAll(".splide__list").length > 1) {
        console.log("排行榜")
        var product_dom = document.querySelectorAll(".splide__list")
        for (var i = 0; i < product_dom.length; i++) {
            if (product_dom[i].children.length > 5) {
                product_list_inner = product_dom[i].querySelectorAll(".splide__slide")
            }
        }
        product_list_inner.forEach(function (product) {
            var id = product.querySelector("a").attributes.href.value
            var reg_g = /\d{15}/g
            id = id.match(reg_g)[0]
            tool.addData(shopData, shop_name, id)
        })
    }

    localStorage.setItem("shopData", JSON.stringify(shopData))
    console.log("已记录店铺数据")
}
async function search_page() {
    var item_count = 0
    var product_list = document.querySelectorAll(".EKDT7a3v")
    var shop_data = tool.localStorage_getStorage("shopData")
    product_list.forEach(async (product) => {
        item_count++
        if (item_count > 12) {
            await tool.sleep(item_count * 10)
        }
        var id_dom = product.querySelectorAll("div")[1]
        // console.log(id_dom)
        var id = id_dom.getAttribute("data-tooltip").match(/\d+/)[0]
        var shop_name = tool.findKeyByName(shop_data, id)
        if (!shop_count[shop_name]) {
            shop_count[shop_name] = 0
        }
        shop_count[shop_name]++
        updateShopCountDisplay(shop_count)
        var button = document.createElement("button")
        button.innerText = shop_name
        button.classList.add("shop_name")
        button.id = shop_name
        button.style.backgroundColor = "rgba(255, 255, 255, 0.2)"
        button.style.cssText = "padding: 10px 15px; border: none; cursor: pointer;z-index: 99999;color:black"
        button.onclick = function () {
            event.stopPropagation()
            // 复制id到粘贴板
            navigator.clipboard.writeText(id)
            tool.copy(id)
            getdata(id)
        }
        // 设置button 的alt信息
        button.setAttribute("alt", "点击复制商品id")
        id_dom.appendChild(button)
    })
}
function updateShopCountDisplay(shop_count) {
    var shopCountContainer = document.querySelector(".shop-count-container")
    if (!shopCountContainer) {
        shopCountContainer = document.createElement("div")
        shopCountContainer.classList.add("shop-count-container")
        shopCountContainer.style.cssText = "position: fixed; top: 0; right: 0; background-color: white; padding: 10px; z-index: 100000;"
        document.body.appendChild(shopCountContainer)
    }
    shopCountContainer.innerHTML = ""
    var shopArray = Object.entries(shop_count)
    shopArray.sort((a, b) => b[1] - a[1])
    shopArray.forEach(([shop_name, count]) => {
        var shopCountElement = document.createElement("div")
        shopCountElement.innerText = `${shop_name}: ${count}`
        shopCountContainer.appendChild(shopCountElement)
    })
}
function cleardata_by_shopname(shop_name) {
    var shopData = tool.localStorage_getStorage("shopData")
    delete shopData[shop_name]
    localStorage.setItem("shopData", JSON.stringify(shopData))
}
// ---------------------------------------------------工具类---------------------------------------------------
class tool {
    static sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
    static localStorage_getStorage(name) {
        var data = localStorage.getItem(name)
        return data ? JSON.parse(data) : {}
    }
    // 创建反向映射
    static createReverseMap(data) {
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

    static findKeyByItem(reverseMap, itemToFind) {
        return reverseMap.get(itemToFind) || null
    }

    static findKeyByName(data, itemToFind) {
        const reverseMap = tool.createReverseMap(data)
        return tool.findKeyByItem(reverseMap, itemToFind)
    }
    static addData(storage, key, value) {
        if (!storage[key]) {
            storage[key] = []
        }
        if (!storage[key].includes(value)) {
            storage[key].push(value)
        }
    }
    static copy(text) {
        var textarea = document.createElement("textarea")
        textarea.textContent = text
        document.body.appendChild(textarea)
        textarea.select()
        try {
            document.execCommand("copy")
            console.log("复制成功", text)
        } catch (err) {
            console.error("复制失败: ", err)
        } finally {
            document.body.removeChild(textarea)
        }
    }
}

// upgrade
// 自动记录搜索关键字
// 销量统计(合并)
// (可选店铺清空数据按钮)

const headers = {
    accept: "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    authorization: "",
    origin: "https://www.geekbi.com",
    priority: "u=1, i",
    "sec-ch-ua": '"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0",
}
function getdata(goodsId) {
    // const goodsId = prompt("请输入商品ID:")
    const params = {
        goodsId: goodsId,
        siteId: "49",
    }

    const url = `https://api.geekbi.com/api/v1/temu/goods/history?goodsId=${params.goodsId}&siteId=${params.siteId}`

    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: headers,
        onload: function (response) {
            if (response.responseText.length > 200) {
                const data = JSON.parse(response.responseText)
                const goods = data.data.goods
                const goodsName = goods.goodsName
                const price = goods.minPrice
                const sold = goods.sold
                const daySold = goods.daySold
                let createTime = goods.onSaleTime

                try {
                    createTime = createTime.substring(0, 10)
                } catch (e) {
                    console.log("时间格式不正确")
                    console.log(createTime)
                }

                console.log("商品名称", goodsName)
                console.log("销量", sold)
                console.log("价格", price)
                console.log("日销量", daySold)
                console.log("上架时间", createTime)

                const text = `${price}\t${sold}\t${daySold}\t${createTime}`
                GM_setClipboard(text)
                console.log("已复制到剪切板", text)
            } else {
                console.log("请求失败")
                console.log(response.responseText)
            }
        },
        onerror: function (error) {
            console.log("请求失败", error)
        },
    })
}


fetch("https://api.temushuju.com/api/v1/goods/info?goodsId=601099526124341&region=211", {
    "referrer": "",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "omit"
  });