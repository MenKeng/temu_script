// ==UserScript==
// @name         Temu一键加入发货台
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键加入发货台,避免无效重复点击
// @author       menkeng
// @license      GPLv3
// @match        https://seller.kuajingmaihuo.com/main/order-manage
// @require      file://C:/Users/Administrator/Desktop/code/greasy/temu_script/Temu一键加入发货台.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=temu.com
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// ==/UserScript==
//脚本定制Q:605011383
//脚本定制Q:605011383
//脚本定制Q:605011383
// this.$ = this.jQuery = jQuery.noConflict(true)
var shipping_desk_flag = false
setTimeout(() => {
    var button_box = tool.createButtonBox(0, 0)
tool.createButton("加入发货台", toggle_shipping_desk, button_box)
}, 2000);
function toggle_shipping_desk() {
    if (shipping_desk_flag == ture){
        shipping_desk()
    }
}

function shipping_desk() {
    var list = $("div.CBX_active_5-113-0")
    for (var i = 0; i < list.length; i++) {
       $(list[i]).closest("tr").find("span:contains('加入发货台')").click()
       $("div[class^='PP_popoverContent']").find("button:contains('确认')").click()
    }
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
        box.style.position = "fixed"
        box.style.top = top + "px"
        box.style.left = left + "px"
        box.style.zIndex = "9999"
        box.style.display = "flex"
        box.style.minWidth = "30px"
        box.style.flexDirection = "row"
        box.style.alignItems = "center"
        box.style.borderRadius = "5px"
        box.style.transition = "width 0.3s ease"
        document.body.appendChild(box)
        return box
    }

    static createButton(text, executeFunction, box) {
        var button = document.createElement("button")
        button.classList.add("fixed-button")
        button.textContent = text
        button.id = text
        button.classList.add("js_fixed-button")
        button.style.backgroundColor = "rgba(255, 255, 255, 0.2)"
        button.style.color = "white"
        button.style.padding = "10px 15px"
        button.style.border = "none"
        button.style.cursor = "pointer"
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
    static setReactValue_textarea = (el, value) => {
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
        el.dispatchEvent(new Event("change", { bubbles: true }))
    }
    static changeReactInputValue(inputDom, newText) {
        let lastValue = inputDom.value
        inputDom.value = newText
        let event = new Event("input", { bubbles: true })
        let changeEvent = new Event("change", { bubbles: true })
        let blurEvent = new Event("blur", { bubbles: true })
        event.simulated = true
        let tracker = inputDom._valueTracker
        if (tracker) {
            tracker.setValue(lastValue)
        }
        inputDom.dispatchEvent(event)
        inputDom.dispatchEvent(changeEvent)
        inputDom.dispatchEvent(blurEvent)
    }
    static simulateMouseClick(element) {
        return new Promise(function (resolve, reject) {
            if (!element) {
                console.error("Element not found")
                return
            }
            var mouseEnterEvent = new MouseEvent("mouseenter", {
                view: document.defaultView,
                bubbles: true,
                cancelable: true,
            })
            element.dispatchEvent(mouseEnterEvent)

            var mouseDownEvent = new MouseEvent("mousedown", {
                view: document.defaultView,
                bubbles: true,
                cancelable: true,
                button: 0,
            })
            element.dispatchEvent(mouseDownEvent)

            var mouseUpEvent = new MouseEvent("mouseup", {
                view: document.defaultView,
                bubbles: true,
                cancelable: true,
                button: 0,
            })
            element.dispatchEvent(mouseUpEvent)

            var clickEvent = new MouseEvent("click", {
                view: document.defaultView,
                bubbles: true,
                cancelable: true,
                button: 0,
            })
            element.dispatchEvent(clickEvent)
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
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            color: white;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            transform: translate(-50%, -50%);
            background-color: ${color};
            padding: 20px;
            z-index: 99999;
        `
        popup.textContent = message
        document.body.appendChild(popup)
        setTimeout(() => {
            document.body.removeChild(popup)
        }, duration)
    }
}
