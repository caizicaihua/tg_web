/**
 * API请求模块
 */

/**
 * 发送产品信息
 */
async function sendAppMessage(message) {
    const token = getTokenFromUrl();
    
    if (!token) {
        throw new Error('缺少访问令牌，请检查链接');
    }
    
    const response = await fetch(CONFIG.API_BASE_URL + CONFIG.ENDPOINTS.ADD_APP, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json, text/javascript, */*; q=0.01'
        },
        body: JSON.stringify({
            token: token,
            text: message
        })
    });
    
    if (!response.ok) {
        throw new Error(`网络请求失败: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 处理响应数据
    if (data.code === 1 || data.status === 1) {
        return {
            success: true,
            data: data.data || data.res_data || {}
        };
    } else {
        // 处理错误情况
        let errorMsg = '发送失败';
        if (data.msg) {
            errorMsg = data.msg;
        } else if (data.message) {
            errorMsg = data.message;
        }
        throw new Error(errorMsg);
    }
}

/**
 * 提交app_add_submit接口
 */
async function submitAppAdd(appNo) {
    const token = getTokenFromUrl();
    
    if (!token) {
        throw new Error('缺少访问令牌');
    }
    
    if (!appNo) {
        throw new Error('缺少app_no信息');
    }
    
    const response = await fetch(CONFIG.API_BASE_URL + CONFIG.ENDPOINTS.SUBMIT_APP, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json, text/javascript, */*; q=0.01'
        },
        body: JSON.stringify({
            token: token,
            app_no: appNo
        })
    });
    
    if (!response.ok) {
        throw new Error(`网络请求失败: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 处理响应数据
    if (data.code === 1 || data.status === 1) {
        return {
            success: true,
            message: '产品信息确认成功！'
        };
    } else {
        // 处理错误情况
        let errorMsg = '确认失败';
        if (data.msg) {
            errorMsg = data.msg;
        } else if (data.message) {
            errorMsg = data.message;
        }
        throw new Error(errorMsg);
    }
}

/**
 * 通用API请求方法
 */
async function apiRequest(endpoint, data = {}) {
    const token = getTokenFromUrl();
    
    if (!token) {
        throw new Error('缺少访问令牌');
    }
    
    const response = await fetch(CONFIG.API_BASE_URL + endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json, text/javascript, */*; q=0.01'
        },
        body: JSON.stringify({
            token: token,
            ...data
        })
    });
    
    if (!response.ok) {
        throw new Error(`网络请求失败: ${response.status}`);
    }
    
    return await response.json();
}

// 导出到全局作用域
window.sendAppMessage = sendAppMessage;
window.submitAppAdd = submitAppAdd;
window.apiRequest = apiRequest;
