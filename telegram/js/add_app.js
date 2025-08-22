/**
 * 主要应用逻辑
 */

// 页面元素
let textarea, submitBtn, loading, successMessage, errorMessage, tokenInfo;

/**
 * 初始化页面
 */
function initPage() {
    // 获取页面元素
    textarea = document.getElementById('messageInput');
    submitBtn = document.getElementById('submitBtn');
    loading = document.getElementById('loading');
    successMessage = document.getElementById('successMessage');
    errorMessage = document.getElementById('errorMessage');
    tokenInfo = document.getElementById('tokenInfo');
    
    // 初始化状态
    AppState.update('initialViewportHeight', window.innerHeight);
    AppState.reset();
    
    // 初始化输入框
    initTextarea();
    
    // 初始化按钮事件
    initButtonEvents();
    
    // 初始化输入法处理
    initKeyboardHandling();
    
    // 防止页面缩放
    preventZoom();
    
    // 添加触摸反馈
    addTouchFeedback();
    
    // 检查token
    checkToken();
    
    // 初始化弹窗事件
    initModalEvents();
}

/**
 * 初始化输入框
 */
function initTextarea() {
    if (!textarea) return;
    
    // 初始化高度
    autoResizeTextarea(textarea);
    
    // 页面加载时也初始化一次
    setTimeout(() => {
        autoResizeTextarea(textarea);
    }, 100);
    
    // 监听输入事件
    textarea.addEventListener('input', function() {
        autoResizeTextarea(this);
    });
    
    // 监听键盘事件（支持Ctrl+Enter发送）
    textarea.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            handleSubmitMessage();
        }
    });
}

/**
 * 初始化按钮事件
 */
function initButtonEvents() {
    if (!submitBtn) return;
    
    // 确保按钮状态正确
    submitBtn.disabled = false;
    submitBtn.style.pointerEvents = 'auto';
    submitBtn.textContent = '发送信息';
    
    // 为发送按钮添加事件监听器
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('发送按钮被点击');
        handleSubmitMessage();
    });
}

/**
 * 检查token
 */
function checkToken() {
    const token = getTokenFromUrl();
    
    if (!token) {
        tokenInfo.textContent = '❌ 未找到Token';
        tokenInfo.style.color = '#dc3545';
        showError('缺少访问令牌，请检查链接是否正确');
        if (submitBtn) submitBtn.disabled = true;
    } else {
        tokenInfo.textContent = '✅ Token已就绪';
        tokenInfo.style.color = '#28a745';
        hideMessages();
        AppState.update('token', token);
    }
}

/**
 * 处理发送信息
 */
async function handleSubmitMessage() {
    console.log('handleSubmitMessage函数被调用');
    
    const message = textarea.value.trim();
    
    // 检查按钮是否已被禁用
    if (submitBtn.disabled) {
        console.log('按钮已被禁用，忽略点击');
        return;
    }
    
    // 验证输入
    if (!message) {
        showError('请输入产品信息');
        return;
    }
    
    // 重置全局变量
    AppState.reset();
    
    // 显示加载状态
    setSubmitButtonLoading(true);
    hideMessages();
    
    try {
        // 发送API请求
        const result = await sendAppMessage(message);
        
        // 显示成功弹窗
        showSuccessModal(result.data);
        textarea.value = '';
        autoResizeTextarea(textarea);
        
    } catch (error) {
        console.error('请求错误:', error);
        showError(error.message || '网络请求失败，请检查网络连接');
    } finally {
        // 恢复按钮状态
        setSubmitButtonLoading(false);
    }
}

/**
 * 设置提交按钮加载状态
 */
function setSubmitButtonLoading(isLoading) {
    if (!submitBtn) return;
    
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.style.pointerEvents = 'none';
        if (loading) loading.style.display = 'inline-block';
        submitBtn.textContent = '发送中';
    } else {
        submitBtn.disabled = false;
        if (loading) loading.style.display = 'none';
        submitBtn.textContent = '发送信息';
        submitBtn.removeAttribute('disabled');
        submitBtn.style.pointerEvents = 'auto';
    }
}

/**
 * 显示成功弹窗
 */
function showSuccessModal(data) {
    const modal = document.getElementById('successModal');
    const resultList = document.getElementById('resultList');
    
    // 保存返回数据到全局变量
    AppState.update('appResultData', data);
    
    // 清空之前的内容
    resultList.innerHTML = '';
    
    // 获取前8个参数
    const keys = Object.keys(data).slice(0, 8);
    
    // 创建结果列表
    keys.forEach(key => {
        const item = document.createElement('div');
        item.className = 'result-item';
        
        const label = document.createElement('div');
        label.className = 'result-label';
        label.textContent = getFieldLabel(key);
        
        const value = document.createElement('div');
        value.className = 'result-value';
        value.textContent = data[key] || '-';
        
        item.appendChild(label);
        item.appendChild(value);
        resultList.appendChild(item);
    });
    
    // 显示弹窗
    modal.style.display = 'block';
    
    // 防止背景滚动
    document.body.style.overflow = 'hidden';
    
    // 确保确认按钮事件监听器已绑定
    setTimeout(() => {
        const confirmBtn = document.querySelector('.confirm-btn');
        if (confirmBtn) {
            // 移除所有之前的事件监听器
            const newConfirmBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
            
            // 添加新的事件监听器
            newConfirmBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('确认按钮被点击（动态绑定）');
                handleConfirmSubmit();
            });
        }
    }, 100);
}

/**
 * 处理确认提交
 */
async function handleConfirmSubmit() {
    console.log('handleConfirmSubmit函数被调用');
    
    // 防重复提交检查
    if (AppState.isSubmitting) {
        console.log('正在提交中，忽略重复点击');
        return;
    }
    
    const appResultData = AppState.appResultData;
    
    if (!appResultData) {
        showError('缺少返回数据，请重新发送信息');
        closeSuccessModal();
        return;
    }
    
    if (!appResultData.app_no) {
        showError('缺少app_no信息');
        return;
    }
    
    // 设置提交状态
    AppState.update('isSubmitting', true);
    
    // 显示加载状态
    const confirmBtn = document.querySelector('.confirm-btn');
    const originalText = confirmBtn.textContent;
    confirmBtn.textContent = '提交中...';
    confirmBtn.disabled = true;
    confirmBtn.style.pointerEvents = 'none';
    
    try {
        // 调用API
        const result = await submitAppAdd(appResultData.app_no);
        
        if (result.success) {
            showSuccess(result.message);
            closeSuccessModal();
        }
        
    } catch (error) {
        console.error('请求错误:', error);
        showError(error.message || '网络请求失败，请检查网络连接');
    } finally {
        // 恢复按钮状态
        confirmBtn.textContent = originalText;
        confirmBtn.disabled = false;
        confirmBtn.style.pointerEvents = 'auto';
        
        // 重置提交状态
        AppState.update('isSubmitting', false);
    }
}

/**
 * 关闭成功弹窗
 */
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    
    // 恢复背景滚动
    document.body.style.overflow = '';
    
    // 清空全局变量
    AppState.reset();
}

/**
 * 初始化弹窗事件
 */
function initModalEvents() {
    // 点击弹窗背景关闭弹窗
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeSuccessModal();
            }
        });
    }
    
    // 点击页面其他区域时收起输入法
    document.addEventListener('click', function(e) {
        if (e.target !== textarea && e.target !== submitBtn) {
            if (textarea) textarea.blur();
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage);
