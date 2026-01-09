window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});const { WebviewWindow } = window.__TAURI__.webviewWindow

// 获取主窗口的 User-Agent
const mainUserAgent = navigator.userAgent

// URL 路径到 title 的映射表
const urlTitleMap = {
    '/mail/': '邮箱',
    '/calendar/': '日历',
    '/space/home/': '云文档',
    '/docx/': '文档',
    '/wiki/': '知识库',
}

// 根据 URL 获取对应的 title
function getTitleFromUrl(url) {
    try {
        const urlObj = new URL(url)
        const pathname = urlObj.pathname
        
        // 遍历映射表，查找匹配的路径
        for (const [path, title] of Object.entries(urlTitleMap)) {
            if (pathname.includes(path)) {
                return title
            }
        }
        
        // 如果没有匹配到，返回默认值
        return '新窗口'
    } catch (e) {
        // URL 解析失败，返回默认值
        return '新窗口'
    }
}

const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        
        const url = origin.href
        const title = getTitleFromUrl(url) || origin.textContent?.trim() || origin.title || '新窗口'
        
        // 使用 Tauri API 在新窗口打开，并设置相同的 User-Agent
        const label = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const webview = new WebviewWindow(label, {
            url: url,
            userAgent: mainUserAgent,
            width: 1200,
            height: 800,
            focus: true,
            title: title,
            center: true,
            resizable: true,
            visible: true,
        })

        webview.once('tauri://created', function () {
            console.log('new webview created')
        })

        webview.once('tauri://error', function (e) {
            console.log('new webview error', e)
        })
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    
    const title = getTitleFromUrl(url)
    
    // 使用 Tauri API 在新窗口打开，并设置相同的 User-Agent
    const label = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const webview = new WebviewWindow(label, {
        url: url,
        userAgent: mainUserAgent,
        width: 1200,
        height: 800,
        focus: true,
        title: title,
        center: true,
        resizable: true,
        visible: true,
    })

    webview.once('tauri://created', function () {
        console.log('new webview created')
    })

    webview.once('tauri://error', function (e) {
        console.log('new webview error', e)
    })
    
    return null
}

document.addEventListener('click', hookClick, { capture: true })