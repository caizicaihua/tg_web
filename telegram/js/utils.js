/**
 * 工具函数模块
 */

// 配置常量
const CONFIG = {
    API_BASE_URL: 'https://bx.jbtls.xyz',
    ENDPOINTS: {
        ADD_APP: '/app_add',
        SUBMIT_APP: '/app_add_submit'
    },
    VALIDATION: {
        REQUIRED_FIELDS: ['bus', 'chat_group', 'area', 'name', 'customer_name']
    }
};

// 全局状态管理
const AppState = {
    token: null,
    isSubmitting: false,
    appResultData: null,
    initialViewportHeight: window.innerHeight,
    isKeyboardVisible: false,
    
    // 更新状态
    update(key, value) {
        this[key] = value;
        console.log(`状态更新: ${key} =`, value);
    },
    
    // 重置状态
    reset() {
        this.isSubmitting = false;
        this.appResultData = null;
    }
};

/**
 * 获取URL参数中的token
 */
function getTokenFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token');
}

/**
 * 自动调整文本框高度
 */
function autoResizeTextarea(textarea) {
    // 重置高度以获取正确的scrollHeight
    textarea.style.height = 'auto';
    
    // 设置新高度
    const newHeight = Math.max(100, textarea.scrollHeight);
    textarea.style.height = newHeight + 'px';
    
    // 限制最大高度为400px
    if (newHeight > 400) {
        textarea.style.height = '400px';
        textarea.style.overflowY = 'auto';
        textarea.style.overflowX = 'hidden';
        console.log('设置滚动条，高度:', newHeight, 'px');
    } else {
        textarea.style.overflowY = 'hidden';
        textarea.style.overflowX = 'hidden';
        console.log('隐藏滚动条，高度:', newHeight, 'px');
    }
    
    // 强制重新计算滚动条
    setTimeout(() => {
        if (newHeight > 400) {
            textarea.style.overflowY = 'auto';
        }
    }, 10);
}

/**
 * 显示成功消息
 */
function showSuccess(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = '✅ ' + message;
    successMessage.style.display = 'block';
    
    // 3秒后自动隐藏
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

/**
 * 显示错误消息
 */
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = '❌ ' + message;
    errorMessage.style.display = 'block';
    
    // 5秒后自动隐藏
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

/**
 * 隐藏所有消息
 */
function hideMessages() {
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
}

/**
 * 获取字段标签
 */
function getFieldLabel(key) {
    const labels = {
        'name': '产品名称',
        'bus': '商务',
        'chat_group': '群名',
        'area': '地区',
        'customer_name': '客户名称',
        'kpi': 'KPI',
        'rate': '费率',
        'loss': '损耗',
        'app_no': '订单号',
        'customer_id': '客户ID',
        'bus_id': '商务ID',
        'am_id': 'AM ID',
        'time_zone': '时区',
        'remark': '备注'
    };
    return labels[key] || key;
}

/**
 * 验证输入数据
 */
function validateInput(data) {
    for (const field of CONFIG.VALIDATION.REQUIRED_FIELDS) {
        if (empty(data[field])) {
            return { valid: false, message: `缺少必填字段: ${getFieldLabel(field)}` };
        }
    }
    return { valid: true };
}

/**
 * 检查值是否为空
 */
function empty(value) {
    return value === null || value === undefined || value === '' || 
           (Array.isArray(value) && value.length === 0);
}

/**
 * 防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 导出到全局作用域
window.CONFIG = CONFIG;
window.AppState = AppState;
window.getTokenFromUrl = getTokenFromUrl;
window.autoResizeTextarea = autoResizeTextarea;
window.showSuccess = showSuccess;
window.showError = showError;
window.hideMessages = hideMessages;
window.getFieldLabel = getFieldLabel;
window.validateInput = validateInput;
window.empty = empty;
window.debounce = debounce;
window.throttle = throttle;

// 测试函数 - 可以在控制台调用
window.testScrollbar = function() {
    const textarea = document.getElementById('messageInput');
    if (textarea) {
        // 添加大量文本测试滚动条
        textarea.value = '测试文本\n'.repeat(50);
        autoResizeTextarea(textarea);
        console.log('测试滚动条完成');
    }
};
