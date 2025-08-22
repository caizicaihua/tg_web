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

// 选项配置
const statusOptions = [
  { label: '待处理', value: 'pending' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' },
  { label: '处理中', value: 'processing' }
]

const typeOptions = [
  { label: '收入', value: 'income' },
  { label: '支出', value: 'expense' }
]

// 表格列配置
const columns = [
  {
    name: 'id',
    label: '交易ID',
    field: 'id',
    align: 'left',
    sortable: true
  },
  {
    name: 'address',
    label: '地址',
    field: 'address',
    align: 'left',
    sortable: true
  },
  {
    name: 'amount',
    label: '金额',
    field: 'amount',
    align: 'right',
    sortable: true
  },
  {
    name: 'type',
    label: '类型',
    field: 'type',
    align: 'center',
    sortable: true
  },
  {
    name: 'status',
    label: '状态',
    field: 'status',
    align: 'center',
    sortable: true
  },
  {
    name: 'createdAt',
    label: '创建时间',
    field: 'createdAt',
    align: 'center',
    sortable: true,
    format: (val: string) => formatDate(val)
  },
  {
    name: 'actions',
    label: '操作',
    field: 'actions',
    align: 'center'
  }
]

// 模拟API调用
const getTransactions = async (params: any) => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // 模拟数据
  const mockData = Array.from({ length: 50 }, (_, i) => ({
    id: `TX${String(i + 1).padStart(6, '0')}`,
    address: `地址${i + 1}`,
    amount: (Math.random() * 10000).toFixed(2),
    type: Math.random() > 0.5 ? 'income' : 'expense',
    status: ['pending', 'completed', 'cancelled', 'processing'][Math.floor(Math.random() * 4)],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    remark: `备注信息 ${i + 1}`
  }))
  
  // 筛选数据
  let filteredData = mockData.filter(item => {
    if (filters.value.status && item.status !== filters.value.status) return false
    if (filters.value.type && item.type !== filters.value.type) return false
    if (filters.value.search && !item.address.includes(filters.value.search)) return false
    return true
  })
  
  // 排序
  filteredData.sort((a, b) => {
    if (pagination.value.sortBy === 'createdAt') {
      return pagination.value.descending 
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    return 0
  })
  
  // 分页
  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage
  const end = start + pagination.value.rowsPerPage
  const pagedData = filteredData.slice(start, end)
  
  return {
    data: pagedData,
    total: filteredData.length,
    statistics: {
      totalIncome: filteredData
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + parseFloat(item.amount), 0)
        .toFixed(2),
      totalExpense: filteredData
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + parseFloat(item.amount), 0)
        .toFixed(2),
      totalCount: filteredData.length
    }
  }
}

// 获取状态颜色
const getStatusColor = (status: string) => {
  const colors = {
    pending: 'warning',
    completed: 'positive',
    cancelled: 'negative',
    processing: 'info'
  }
  return colors[status as keyof typeof colors] || 'grey'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const texts = {
    pending: '待处理',
    completed: '已完成',
    cancelled: '已取消',
    processing: '处理中'
  }
  return texts[status as keyof typeof texts] || '未知'
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
  } catch (error) {
    console.error('加载失败:', error)
    $q.notify({
      message: '加载数据失败',
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
