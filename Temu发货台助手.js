// ==UserScript==
// @name         Temu发货台助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键加入发货台,备货单,备货单发货
// @author       menkeng
// @license      GPLv3
// @match        https://seller.kuajingmaihuo.com/main/order-manage
// @match        https://seller.kuajingmaihuo.com/main/order-manager/shipping-desk
// @match        https://seller.kuajingmaihuo.com/main/order-manager/shipping-list
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=temu.com
// ==/UserScript==
//脚本定制Q:605011383
//脚本定制Q:605011383
//脚本定制Q:605011383
const 备货单 = "https://seller.kuajingmaihuo.com/main/order-manage"
const 发货台 = "https://seller.kuajingmaihuo.com/main/order-manager/shipping-desk"
const 发货单列表 = "https://seller.kuajingmaihuo.com/main/order-manager/shipping-list"

// 监听 popstate 事件
window.addEventListener("popstate", function () {
    checkUrl()
})
window.addEventListener("hashchange", function () {
    checkUrl()
})
window.onload = function () {
    checkUrl()
}

function checkUrl() {
    var button_box = tool.createButtonBox(80, 100)
    var url = window.location.href
    if (url.match(备货单)) {
        console.log("备货单")
        tool.createButton("开始抢发货台", toggle_get_ship, button_box)
    } else if (url.match(发货台)) {
        console.log("发货台")
        tool.createButton("发货", query_shipnum, button_box)
    } else if (url.match(发货单列表)) {
        console.log("发货单列表")
        tool.createButton("发货", query_shipnum, button_box)
    }
}
var isGettingShipping = false
var get_shipping_interval
function toggle_get_ship() {
    isGettingShipping = !isGettingShipping
    var text = isGettingShipping ? "开始抢发货台" : "停止抢发货台"

    document.querySelector("#开始/停止抢发货台").innerText = text

    if (isGettingShipping) {
        get_shipping()
    } else {
        clearInterval(get_shipping_interval)
    }
}
function get_shipping() {
    get_shipping_interval = setInterval(() => {
        if (!isGettingShipping) {
            clearInterval(get_shipping_interval)
            const masks = document.querySelectorAll(".MDL_mask_5-113-0")
            masks.forEach((mask) => {
                mask.remove()
            })
            const masks2 = document.querySelectorAll(".MDL_alert_5-113-0")
            masks2.forEach((mask) => {
                mask.remove()
            })
            const masks3 = document.querySelectorAll(".MDL_withLogo_5-113-0")
            masks3.forEach((mask) => {
                mask.remove()
            })
            return
        }
        $("#root")
            .find("a")
            .each(function () {
                let link = $(this),
                    text = link.text()
                if (text === "加入发货台") {
                    let buttons = $('div[data-testid="beast-core-portal-main"]').find("button")
                    if (!link.is("[disabled]")) {
                        console.log("点击2")
                        simulateMouseClick(link.get(0)).then(function () {
                            buttons.each(function () {
                                simulateMouseClick($(this).get(0)).then(function () {})
                            })
                        })
                    } else if (buttons.length > 0) {
                        buttons.each(function () {
                            simulateMouseClick($(this).get(0)).then(function () {})
                        })
                    }
                }
            })
    }, 1000)
}

class tool {
    static createButtonBox(top, left) {
        var existingBox = document.getElementById("js_buttonbox")
        if (existingBox) {
            return existingBox
        }
        var box = document.createElement("div")
        box.className = "js_buttonbox"
        box.id = "js_buttonbox"
        box.style.cssText = `position: fixed; top: ${top}px; left: ${left}px; z-index: 9999; display: flex; min-width: 30px; flex-direction: row; align-items: center; border-radius: 5px; transition: width 0.3s ease;`
        document.body.appendChild(box)
        return box
    }

    static createButton(text, executeFunction, box) {
        var button = document.createElement("button")
        button.classList.add("fixed-button")
        button.textContent = text
        button.id = text
        button.classList.add("js_fixed-button")
        button.style.cssText = "background-color: rgba(255, 255, 255, 0.2); color: white; padding: 10px 15px; border: none; cursor: pointer;"
        button.addEventListener("click", executeFunction)
        box.appendChild(button)
    }

    static fn_dispatchEvent(element, eventType) {
        const event = new MouseEvent(eventType, {
            view: document.defaultView,
            bubbles: true,
            cancelable: true,
        })
        element.dispatchEvent(event)
    }

    static removeButtons() {
        var buttons = document.querySelectorAll(".js_fixed-button")
        buttons.forEach(function (button) {
            button.remove()
        })
    }
    static setReactValue_textarea(el, value) {
        const previousValue = el.value

        if (el.type === "checkbox" || el.type === "radio") {
            if ((!!value && !el.checked) || (!!!value && el.checked)) {
                el.click()
            }
        } else el.value = value

        const tracker = el._valueTracker
        if (tracker) {
            tracker.setValue(previousValue)
        }
        tool.fn_dispatchEvent(el, "change")
    }
    static changeReactInputValue(inputDom, newText) {
        let lastValue = inputDom.value
        inputDom.value = newText
        event.simulated = true
        let tracker = inputDom._valueTracker
        if (tracker) {
            tracker.setValue(lastValue)
        }
        tool.fn_dispatchEvent(inputDom, "input")
        tool.fn_dispatchEvent(inputDom, "change")
        tool.fn_dispatchEvent(inputDom, "blur")
    }
    static simulateMouseClick(element) {
        return new Promise(function (resolve, reject) {
            if (!element) {
                console.error("Element not found")
                return
            }
            tool.fn_dispatchEvent(element, "mousedown")
            tool.fn_dispatchEvent(element, "mouseup")
            tool.fn_dispatchEvent(element, "click")
            tool.fn_dispatchEvent(element, "mouseenter")
            tool.fn_dispatchEvent(element, "mouseleave")
            resolve()
        })
    }
    static copy(text) {
        var textarea = document.createElement("textarea")
        textarea.textContent = text
        document.body.appendChild(textarea)
        textarea.select()
        try {
            document.execCommand("copy")
            console.log("复制成功")
        } catch (err) {
            console.error("复制失败: ", err)
        } finally {
            document.body.removeChild(textarea)
        }
    }
    static showPopup(message, duration = 5000, color = "red") {
        const popup = document.createElement("div")
        popup.style.cssText = `position: fixed; top: 50%; left: 50%; color: white; font-size: 16px; font-weight: bold; text-align: center; transform: translate(-50%, -50%); background-color: ${color}; padding: 20px; z-index: 99999;`
        popup.textContent = message
        document.body.appendChild(popup)
        setTimeout(() => {
            document.body.removeChild(popup)
        }, duration)
    }
}

// upgrade
// 发货台改最大数量
// 发货单自动改重量
