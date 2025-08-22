/**
 * 输入法处理模块
 */

/**
 * 输入法弹出时的处理
 */
function handleKeyboardShow() {
    // 滚动到输入框位置
    setTimeout(() => {
        const textarea = document.getElementById('messageInput');
        if (textarea) {
            textarea.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }, 100);
}

/**
 * 输入法收起时的处理
 */
function handleKeyboardHide() {
    // 滚动到页面顶部
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
}

/**
 * 初始化输入法处理
 */
function initKeyboardHandling() {
    // 监听视口高度变化（输入法弹出/收起）
    window.addEventListener('resize', throttle(function() {
        const currentHeight = window.innerHeight;
        const heightDifference = AppState.initialViewportHeight - currentHeight;
        
        // 如果高度减少超过150px，认为输入法弹出
        if (heightDifference > 150 && !AppState.isKeyboardVisible) {
            AppState.update('isKeyboardVisible', true);
            handleKeyboardShow();
        } 
        // 如果高度恢复，认为输入法收起
        else if (heightDifference < 50 && AppState.isKeyboardVisible) {
            AppState.update('isKeyboardVisible', false);
            handleKeyboardHide();
        }
    }, 100));

    // 输入框获得焦点时的处理
    const textarea = document.getElementById('messageInput');
    if (textarea) {
        textarea.addEventListener('focus', function() {
            // 延迟处理，等待输入法弹出
            setTimeout(() => {
                if (window.innerHeight < AppState.initialViewportHeight - 100) {
                    handleKeyboardShow();
                }
            }, 300);
        });

        // 输入框失去焦点时的处理
        textarea.addEventListener('blur', function() {
            // 延迟处理，等待输入法收起
            setTimeout(() => {
                if (window.innerHeight > AppState.initialViewportHeight - 50) {
                    handleKeyboardHide();
                }
            }, 300);
        });
    }
}

/**
 * 防止页面缩放（iOS）
 */
function preventZoom() {
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });
}

/**
 * 添加触摸反馈
 */
function addTouchFeedback() {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        submitBtn.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    }
}

// 导出到全局作用域
window.handleKeyboardShow = handleKeyboardShow;
window.handleKeyboardHide = handleKeyboardHide;
window.initKeyboardHandling = initKeyboardHandling;
window.preventZoom = preventZoom;
window.addTouchFeedback = addTouchFeedback;
