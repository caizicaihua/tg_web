/**
 * Telegram Web App POST API 封装
 * 用于处理与服务器的POST通信
 */
class TelegramPostAPI {
    constructor(baseURL = 'https://bx.jbtls.xyz') {
        this.baseURL = baseURL;
        this.initData = null;
        this.user = null;
        this.isTelegramWebApp = false;
        
        // 初始化
        this.init();
    }

    /**
     * 初始化Telegram Web App环境
     */
    init() {
        // 检测是否在Telegram Web App环境中
        if (window.Telegram && window.Telegram.WebApp) {
            this.isTelegramWebApp = true;
            this.initData = window.Telegram.WebApp.initData;
            this.user = window.Telegram.WebApp.initDataUnsafe?.user;
            
            console.log('Telegram Web App 环境检测成功');
            console.log('initData:', this.initData);
            console.log('user:', this.user);
        } else {
            console.log('非Telegram Web App环境');
        }
    }

    /**
     * 构建请求头
     * @returns {Object} 请求头对象
     */
    buildHeaders() {
        const headers = {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'token': this.initData || ''
        };

        return headers;
    }

    /**
     * 发送POST请求
     * @param {string} endpoint - API端点
     * @param {Object} data - 请求数据
     * @returns {Promise} 请求结果
     */
    async post(endpoint, data = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = this.buildHeaders();
        
        const config = {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        };

        console.log(`发送POST请求到: ${url}`);
        console.log('请求数据:', data);
        console.log('请求配置:', config);

        try {
            const response = await fetch(url, config);
            
            console.log(`响应状态: ${response.status} ${response.statusText}`);
            console.log(`响应类型: ${response.type}`);
            console.log(`响应URL: ${response.url}`);
            
            // 记录响应头
            const responseHeaders = {};
            response.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });
            console.log('响应头:', responseHeaders);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const text = await response.text();
            console.log(`响应内容长度: ${text.length}`);
            console.log(`响应内容: ${text}`);

            // 检查响应是否为空
            if (!text || text.trim() === '') {
                throw new Error('响应内容为空');
            }

            // 尝试解析JSON
            try {
                const data = JSON.parse(text);
                return {
                    success: true,
                    data: data,
                    response: response,
                    rawText: text
                };
            } catch (parseError) {
                console.error('响应解析失败:', parseError.message);
                console.error('原始响应:', text);
                
                // 检测响应类型
                let errorType = '未知格式';
                if (text.includes('<!DOCTYPE html>') || text.includes('<html>')) {
                    errorType = 'HTML页面';
                } else if (text.includes('<?php')) {
                    errorType = 'PHP代码';
                }
                
                throw new Error(`响应格式错误 (${errorType}): ${parseError.message}`);
            }
        } catch (error) {
            console.error('POST请求失败:', error);
            
            // 检查错误类型
            const errorMessage = error.message || error.toString();
            if (errorMessage.includes('CORS') || errorMessage.includes('cross-origin')) {
                console.error('可能是CORS跨域问题');
            } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
                console.error('网络连接失败，请检查服务器状态');
            }
            
            return {
                success: false,
                error: error.message || error.toString(),
                response: null,
                rawText: null
            };
        }
    }

    // ==================== Telegram 特定API方法 ====================

    /**
     * 验证Telegram Web App认证
     * @returns {Promise} 验证结果
     */
    async validateAuth() {
        return this.post('/api/telegram/validate-auth');
    }

    /**
     * 测试路由连接
     * @returns {Promise} 测试结果
     */
    async testRoute() {
        return this.post('/api/telegram/test');
    }

    /**
     * 生成测试数据
     * @returns {Promise} 测试数据
     */
    async generateTestData() {
        return this.post('/api/telegram/generate-test-data');
    }

    // ==================== 业务API方法 ====================

    /**
     * 添加地址
     * @param {Object} data - 地址数据
     * @returns {Promise} 添加结果
     */
    async addAddress(data) {
        return this.post('/api/external/add_address', data);
    }

    /**
     * 更新应用信息
     * @param {Object} data - 应用数据
     * @returns {Promise} 更新结果
     */
    async updateAppInfo(data) {
        return this.post('/api/external/update_app_info', data);
    }

    /**
     * 标记完全分配
     * @param {Object} data - 分配数据
     * @returns {Promise} 标记结果
     */
    async markFullyAllocated(data) {
        return this.post('/api/external/mark_fully_allocated', data);
    }

    /**
     * 取消分配
     * @param {Object} data - 取消数据
     * @returns {Promise} 取消结果
     */
    async cancelAllocation(data) {
        return this.post('/api/external/cancel_allocation', data);
    }

    // ==================== 工具方法 ====================

    /**
     * 获取当前用户信息
     * @returns {Object|null} 用户信息
     */
    getCurrentUser() {
        return this.user;
    }

    /**
     * 获取initData
     * @returns {string|null} initData
     */
    getInitData() {
        return this.initData;
    }

    /**
     * 检查是否在Telegram Web App环境中
     * @returns {boolean} 是否在Telegram环境中
     */
    isInTelegramWebApp() {
        return this.isTelegramWebApp;
    }

    /**
     * 显示Telegram Web App主按钮
     * @param {string} text - 按钮文本
     * @param {string} color - 按钮颜色
     */
    showMainButton(text = '确认', color = '#2481cc') {
        if (this.isTelegramWebApp && window.Telegram.WebApp.MainButton) {
            window.Telegram.WebApp.MainButton.setText(text);
            window.Telegram.WebApp.MainButton.setParams({
                color: color
            });
            window.Telegram.WebApp.MainButton.show();
        }
    }

    /**
     * 隐藏Telegram Web App主按钮
     */
    hideMainButton() {
        if (this.isTelegramWebApp && window.Telegram.WebApp.MainButton) {
            window.Telegram.WebApp.MainButton.hide();
        }
    }

    /**
     * 设置Telegram Web App主按钮点击事件
     * @param {Function} callback - 点击回调函数
     */
    onMainButtonClick(callback) {
        if (this.isTelegramWebApp && window.Telegram.WebApp.MainButton) {
            window.Telegram.WebApp.MainButton.onClick(callback);
        }
    }

    /**
     * 关闭Telegram Web App
     */
    closeWebApp() {
        if (this.isTelegramWebApp && window.Telegram.WebApp.close) {
            window.Telegram.WebApp.close();
        }
    }

    /**
     * 扩展Telegram Web App
     */
    expandWebApp() {
        if (this.isTelegramWebApp && window.Telegram.WebApp.expand) {
            window.Telegram.WebApp.expand();
        }
    }

    /**
     * 设置Telegram Web App标题
     * @param {string} title - 标题
     */
    setWebAppTitle(title) {
        if (this.isTelegramWebApp && window.Telegram.WebApp.setHeaderColor) {
            window.Telegram.WebApp.setHeaderColor('#2481cc');
        }
        if (this.isTelegramWebApp && window.Telegram.WebApp.ready) {
            window.Telegram.WebApp.ready();
        }
    }

    /**
     * 显示Telegram Web App确认对话框
     * @param {string} message - 消息内容
     * @param {Function} callback - 确认回调
     */
    showConfirm(message, callback) {
        if (this.isTelegramWebApp && window.Telegram.WebApp.showConfirm) {
            window.Telegram.WebApp.showConfirm(message, callback);
        } else {
            // 降级到浏览器原生确认
            if (confirm(message)) {
                callback && callback(true);
            } else {
                callback && callback(false);
            }
        }
    }

    /**
     * 显示Telegram Web App警告
     * @param {string} message - 警告消息
     */
    showAlert(message) {
        if (this.isTelegramWebApp && window.Telegram.WebApp.showAlert) {
            window.Telegram.WebApp.showAlert(message);
        } else {
            // 降级到浏览器原生警告
            alert(message);
        }
    }
}

// 创建全局实例
window.TelegramPostAPI = new TelegramPostAPI();

// 导出模块（如果支持）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TelegramPostAPI;
}
