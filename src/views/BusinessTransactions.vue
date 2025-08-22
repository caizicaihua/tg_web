<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- 页面标题 -->
      <div class="col-12">
        <q-card class="bg-accent text-white">
          <q-card-section>
            <div class="text-h5">📊 商务流水</div>
            <div class="text-subtitle2">商务地址流水和状态展示</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 筛选和搜索 -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-3">
                <q-select
                  v-model="filters.status"
                  :options="statusOptions"
                  label="状态筛选"
                  outlined
                  clearable
                  @update:model-value="loadTransactions"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-select
                  v-model="filters.type"
                  :options="typeOptions"
                  label="类型筛选"
                  outlined
                  clearable
                  @update:model-value="loadTransactions"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="filters.search"
                  label="搜索地址"
                  outlined
                  clearable
                  @keyup.enter="loadTransactions"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-2">
                <q-btn
                  color="primary"
                  label="搜索"
                  icon="search"
                  @click="loadTransactions"
                  class="full-width"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 数据表格 -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h6">流水列表</div>
              <div class="text-caption text-grey">
                共 {{ pagination.rowsNumber }} 条记录
              </div>
            </div>
            
            <q-table
              :rows="transactions"
              :columns="columns"
              :loading="loading"
              :pagination="pagination"
              row-key="id"
              @request="onRequest"
              :rows-per-page-options="[10, 20, 50, 100]"
            >
              <!-- 状态列 -->
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-chip
                    :color="getStatusColor(props.value)"
                    text-color="white"
                    size="sm"
                  >
                    {{ getStatusText(props.value) }}
                  </q-chip>
                </q-td>
              </template>

              <!-- 金额列 -->
              <template v-slot:body-cell-amount="props">
                <q-td :props="props">
                  <span class="text-weight-medium" :class="getAmountColor(props.row.type)">
                    {{ props.row.type === 'income' ? '+' : '-' }}¥{{ props.value }}
                  </span>
                </q-td>
              </template>

              <!-- 操作列 -->
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    round
                    color="primary"
                    icon="visibility"
                    size="sm"
                    @click="viewDetails(props.row)"
                  >
                    <q-tooltip>查看详情</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    color="secondary"
                    icon="edit"
                    size="sm"
                    @click="editTransaction(props.row)"
                  >
                    <q-tooltip>编辑</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>

      <!-- 统计信息 -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">统计信息</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-3">
                <q-card class="bg-positive text-white">
                  <q-card-section>
                    <div class="text-h6">总收入</div>
                    <div class="text-h4">¥{{ statistics.totalIncome }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-md-3">
                <q-card class="bg-negative text-white">
                  <q-card-section>
                    <div class="text-h6">总支出</div>
                    <div class="text-h4">¥{{ statistics.totalExpense }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-md-3">
                <q-card class="bg-info text-white">
                  <q-card-section>
                    <div class="text-h6">净收入</div>
                    <div class="text-h4">¥{{ statistics.netIncome }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-md-3">
                <q-card class="bg-warning text-white">
                  <q-card-section>
                    <div class="text-h6">交易笔数</div>
                    <div class="text-h4">{{ statistics.totalCount }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- 详情对话框 -->
    <q-dialog v-model="showDetails" maximized>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">交易详情</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedTransaction">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>交易ID</q-item-label>
                <q-item-label caption>{{ selectedTransaction.id }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>地址</q-item-label>
                <q-item-label caption>{{ selectedTransaction.address }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>金额</q-item-label>
                <q-item-label caption class="text-h6" :class="getAmountColor(selectedTransaction.type)">
                  {{ selectedTransaction.type === 'income' ? '+' : '-' }}¥{{ selectedTransaction.amount }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>状态</q-item-label>
                <q-item-label caption>
                  <q-chip
                    :color="getStatusColor(selectedTransaction.status)"
                    text-color="white"
                    size="sm"
                  >
                    {{ getStatusText(selectedTransaction.status) }}
                  </q-chip>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>创建时间</q-item-label>
                <q-item-label caption>{{ formatDate(selectedTransaction.createdAt) }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>备注</q-item-label>
                <q-item-label caption>{{ selectedTransaction.remark || '无' }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useTelegramStore } from '@/stores/telegram'
import { businessTransactionAPI, getAuthToken, getTokenStatus } from '@/services/api'

const $q = useQuasar()
const telegramStore = useTelegramStore()

// 响应式数据
const loading = ref(false)
const transactions = ref<any[]>([])
const showDetails = ref(false)
const selectedTransaction = ref<any>(null)

// 筛选条件
const filters = ref({
  status: null,
  type: null,
  search: ''
})

// 分页配置
const pagination = ref({
  sortBy: 'createdAt',
  descending: true,
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0
})

// 统计信息
const statistics = ref({
  totalIncome: '0.00',
  totalExpense: '0.00',
  netIncome: '0.00',
  totalCount: 0
})

// 选项配置 - 匹配你的数据结构
const statusOptions = [
  { label: '待确认', value: 0 },
  { label: '已确认', value: 1 }
]

const typeOptions = [
  { label: '全部', value: '' },
  { label: '已确认', value: 1 },
  { label: '待确认', value: 0 }
]

// 表格列配置 - 匹配你的数据结构
const columns = [
  {
    name: 'id',
    label: '流水号',
    field: 'id',
    align: 'left',
    sortable: true
  },
  {
    name: 'from_address',
    label: '打款地址',
    field: 'from_address',
    align: 'left',
    sortable: true
  },
  {
    name: 'to_address',
    label: '收款地址',
    field: 'to_address',
    align: 'left',
    sortable: true
  },
  {
    name: 'transfer_amount',
    label: 'USDT数量',
    field: 'transfer_amount',
    align: 'right',
    sortable: true
  },
  {
    name: 'trade_time',
    label: '交易时间',
    field: 'trade_time',
    align: 'center',
    sortable: true,
    format: (val: string) => formatDate(val)
  },
  {
    name: 'check_status',
    label: '状态',
    field: 'check_status',
    align: 'center',
    sortable: true
  },
  {
    name: 'actions',
    label: '操作',
    field: 'actions',
    align: 'center'
  }
]

// 使用统一的认证服务
const getToken = getAuthToken

// 真实API调用
const getTransactions = async (params: any) => {
  try {
    const adminId = getToken()
    if (!adminId) {
      throw new Error('缺少访问令牌，请检查Telegram Web App配置')
    }
    const response = await businessTransactionAPI.getList(adminId, params.page || 1, params.rowsPerPage || 100)
    
    // API层已经处理了code状态，这里直接处理数据
    const tradeList = response.data || []
    
    // 计算统计数据
    const totalIncome = tradeList
      .filter((item: any) => item.transfer_amount && parseFloat(item.transfer_amount) > 0)
      .reduce((sum: number, item: any) => sum + parseFloat(item.transfer_amount), 0)
      .toFixed(2)
    
    const totalExpense = '0.00' // 根据你的数据结构调整
    const totalCount = tradeList.length
    
    return {
      data: tradeList,
      total: totalCount,
      statistics: {
        totalIncome,
        totalExpense,
        totalCount
      }
    }
  } catch (error: any) {
    // API层已经处理了错误，直接抛出
    throw error
  }
}

// 获取统计信息
const getStatistics = async (params?: any) => {
  try {
    const adminId = getToken()
    if (!adminId) {
      throw new Error('缺少访问令牌，请检查Telegram Web App配置')
    }
    const response = await businessTransactionAPI.getStatistics(adminId)
    
    // API层已经处理了code状态，这里直接处理数据
    const tradeList = response.data || []
    
    // 计算统计数据
    const totalIncome = tradeList
      .filter((item: any) => item.transfer_amount && parseFloat(item.transfer_amount) > 0)
      .reduce((sum: number, item: any) => sum + parseFloat(item.transfer_amount), 0)
      .toFixed(2)
    
    const totalExpense = '0.00' // 根据你的数据结构调整
    const totalCount = tradeList.length
    
    return {
      totalIncome,
      totalExpense,
      totalCount
    }
  } catch (error) {
    console.error('获取统计信息失败:', error)
    return null
  }
}

// 获取状态颜色 - 匹配你的数据结构
const getStatusColor = (status: any) => {
  // 根据你的数据结构调整
  if (status === 1) return 'positive'
  if (status === 0) return 'warning'
  return 'grey'
}

// 获取状态文本 - 匹配你的数据结构
const getStatusText = (status: any) => {
  // 根据你的数据结构调整
  if (status === 1) return '已确认'
  if (status === 0) return '待确认'
  return '未知'
}

// 获取金额颜色
const getAmountColor = (type: string) => {
  return type === 'income' ? 'text-positive' : 'text-negative'
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

// 加载交易数据
const loadTransactions = async () => {
  loading.value = true
  
  try {
    const result = await getTransactions({
      page: pagination.value.page,
      rowsPerPage: pagination.value.rowsPerPage,
      sortBy: pagination.value.sortBy,
      descending: pagination.value.descending,
      ...filters.value
    })
    
    transactions.value = result.data
    pagination.value.rowsNumber = result.total
    statistics.value = {
      ...result.statistics,
      netIncome: (parseFloat(result.statistics.totalIncome) - parseFloat(result.statistics.totalExpense)).toFixed(2)
    }
    
    // 如果统计数据为空，单独获取统计信息
    if (!result.statistics || result.statistics.totalCount === 0) {
      const stats = await getStatistics(filters.value)
      if (stats) {
        statistics.value = {
          ...stats,
          netIncome: (parseFloat(stats.totalIncome) - parseFloat(stats.totalExpense)).toFixed(2)
        }
      }
    }
  } catch (error) {
    console.error('加载失败:', error)
    $q.notify({
      message: error instanceof Error ? error.message : '加载数据失败',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

// 处理表格请求
const onRequest = (props: any) => {
  pagination.value = props.pagination
  loadTransactions()
}

// 查看详情
const viewDetails = (transaction: any) => {
  selectedTransaction.value = transaction
  showDetails.value = true
  telegramStore.hapticImpact('light')
}

// 编辑交易
const editTransaction = (transaction: any) => {
  telegramStore.showNotification('编辑功能开发中...', 'info')
  telegramStore.hapticImpact('medium')
}

// 初始化
onMounted(() => {
  loadTransactions()
  
  // 设置主按钮
  telegramStore.showMainButton('刷新', loadTransactions)
  
  // 设置返回按钮
  telegramStore.showBackButton(() => {
    telegramStore.hideBackButton()
  })
})
</script>
