import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import Questions from './Questions.vue'
import * as api from '../../api'
import ElementPlus from 'element-plus'

const mockQuestions = [
  { id: 1, type: 'SINGLE', content: '题目1', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', answer: 'A', score: 10 },
  { id: 2, type: 'MULTIPLE', content: '题目2', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', answer: 'ABC', score: 10 },
  { id: 3, type: 'SINGLE', content: '题目3', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', answer: 'B', score: 10 },
  { id: 4, type: 'MULTIPLE', content: '题目4', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', answer: 'ABD', score: 10 },
  { id: 5, type: 'SINGLE', content: '题目5', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', answer: 'C', score: 10 },
  { id: 6, type: 'MULTIPLE', content: '题目6', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', answer: 'ACD', score: 10 },
  { id: 7, type: 'SINGLE', content: '题目7', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', answer: 'D', score: 10 },
  { id: 8, type: 'MULTIPLE', content: '题目8', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', answer: 'BCD', score: 10 },
  { id: 9, type: 'SINGLE', content: '题目9', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', answer: 'A', score: 10 },
  { id: 10, type: 'MULTIPLE', content: '题目10', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', answer: 'AB', score: 10 },
  { id: 11, type: 'SINGLE', content: '题目11', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', answer: 'B', score: 10 },
  { id: 12, type: 'MULTIPLE', content: '题目12', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', answer: 'CD', score: 10 },
  { id: 13, type: 'SINGLE', content: '题目13', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', answer: 'C', score: 10 }
]

vi.mock('../../api', () => ({
  getQuestions: vi.fn(() => Promise.resolve(mockQuestions)),
  addQuestion: vi.fn(() => Promise.resolve({ id: 14 })),
  updateQuestion: vi.fn(() => Promise.resolve()),
  deleteQuestion: vi.fn(() => Promise.resolve())
}))

vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')
  return {
    ...actual,
    ElMessage: {
      success: vi.fn(),
      error: vi.fn()
    },
    ElMessageBox: {
      confirm: vi.fn(() => Promise.resolve())
    }
  }
})

const mountComponent = async () => {
  const wrapper = mount(Questions, {
    global: {
      plugins: [ElementPlus],
      stubs: {
        'el-icon': true,
        'Plus': true
      }
    }
  })
  await flushPromises()
  await nextTick()
  return wrapper
}

describe('Questions.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('组件渲染', () => {
    it('应该渲染题库管理标题', async () => {
      const wrapper = await mountComponent()
      expect(wrapper.text()).toContain('题库管理')
    })

    it('应该渲染新增题目按钮', async () => {
      const wrapper = await mountComponent()
      expect(wrapper.text()).toContain('新增题目')
    })

    it('应该渲染表格', async () => {
      const wrapper = await mountComponent()
      expect(wrapper.find('.el-table').exists()).toBe(true)
    })

    it('应该渲染分页组件', async () => {
      const wrapper = await mountComponent()
      expect(wrapper.find('.el-pagination').exists()).toBe(true)
    })

    it('应该在onMounted时加载题目列表', async () => {
      await mountComponent()
      expect(api.getQuestions).toHaveBeenCalledTimes(1)
    })

    it('应该显示13条题目总数', async () => {
      const wrapper = await mountComponent()
      expect(wrapper.text()).toContain('13')
    })
  })

  describe('分页功能', () => {
    it('pagedQuestions计算属性 - 第1页应该返回前10条数据', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      vm.currentPage = 1
      vm.pageSize = 10
      await nextTick()
      expect(vm.pagedQuestions.length).toBe(10)
      expect(vm.pagedQuestions[0].id).toBe(1)
      expect(vm.pagedQuestions[9].id).toBe(10)
    })

    it('pagedQuestions计算属性 - 第2页应该返回后3条数据', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      vm.currentPage = 2
      vm.pageSize = 10
      await nextTick()
      expect(vm.pagedQuestions.length).toBe(3)
      expect(vm.pagedQuestions[0].id).toBe(11)
      expect(vm.pagedQuestions[2].id).toBe(13)
    })

    it('pagedQuestions计算属性 - 每页5条时第2页返回ID 6-10', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      vm.currentPage = 2
      vm.pageSize = 5
      await nextTick()
      expect(vm.pagedQuestions.length).toBe(5)
      expect(vm.pagedQuestions[0].id).toBe(6)
      expect(vm.pagedQuestions[4].id).toBe(10)
    })

    it('handleSizeChange - 改变每页条数时应该重置到第1页', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      vm.currentPage = 3
      vm.handleSizeChange(20)
      expect(vm.pageSize).toBe(20)
      expect(vm.currentPage).toBe(1)
    })

    it('handleCurrentChange - 改变页码时应该更新currentPage', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      vm.handleCurrentChange(3)
      expect(vm.currentPage).toBe(3)
    })
  })

  describe('表单功能', () => {
    it('getInitialForm应该返回正确的初始表单', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      const initialForm = vm.getInitialForm()
      expect(initialForm).toEqual({
        id: null,
        type: 'SINGLE',
        content: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        answer: '',
        score: 10
      })
    })

    it('resetForm应该重置表单和answerArray', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      vm.form = {
        id: 1,
        type: 'MULTIPLE',
        content: '测试',
        optionA: 'A',
        optionB: 'B',
        optionC: 'C',
        optionD: 'D',
        answer: 'ABC',
        score: 20
      }
      vm.answerArray = ['A', 'B', 'C']
      vm.resetForm()
      expect(vm.form).toEqual(vm.getInitialForm())
      expect(vm.answerArray).toEqual([])
    })

    it('openAddDialog应该打开新增弹窗并重置表单', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      vm.dialogVisible = false
      vm.isEdit = true
      vm.form = { ...vm.form, content: '旧内容' }
      vm.openAddDialog()
      expect(vm.dialogVisible).toBe(true)
      expect(vm.isEdit).toBe(false)
      expect(vm.form.content).toBe('')
    })

    it('openEditDialog应该打开编辑弹窗并填充数据（单选题）', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      const question = mockQuestions[0]
      vm.openEditDialog(question)
      await flushPromises()
      await nextTick()
      await nextTick()
      expect(vm.dialogVisible).toBe(true)
      expect(vm.isEdit).toBe(true)
      expect(vm.form.id).toBe(1)
      expect(vm.form.content).toBe('题目1')
      expect(vm.form.answer).toBe('A')
    })

    it('openEditDialog应该打开编辑弹窗并填充数据（多选题，答案回显）', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      const question = mockQuestions[1]
      vm.openEditDialog(question)
      await flushPromises()
      await nextTick()
      await nextTick()
      await nextTick()
      expect(vm.dialogVisible).toBe(true)
      expect(vm.isEdit).toBe(true)
      expect(vm.form.id).toBe(2)
      expect(vm.form.type).toBe('MULTIPLE')
      expect(vm.answerArray).toEqual(['A', 'B', 'C'])
      expect(vm.form.answer).toBe('ABC')
    })
  })

  describe('答案控件切换', () => {
    it('单选题时应该显示radio控件', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      vm.openAddDialog()
      await nextTick()
      vm.form = { ...vm.form, type: 'SINGLE' }
      await nextTick()
      const html = wrapper.html()
      const hasRadioGroup = html.includes('el-radio-group')
      const hasCheckboxGroup = html.includes('el-checkbox-group')
      expect(hasRadioGroup).toBe(true)
      expect(hasCheckboxGroup).toBe(false)
    })

    it('多选题时应该显示checkbox控件', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      vm.openAddDialog()
      await nextTick()
      vm.form = { ...vm.form, type: 'MULTIPLE' }
      await nextTick()
      const html = wrapper.html()
      const hasCheckboxGroup = html.includes('el-checkbox-group')
      expect(hasCheckboxGroup).toBe(true)
    })

    it('切换题型时应该清空答案', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      vm.form = { ...vm.form, type: 'SINGLE', answer: 'A' }
      vm.answerArray = []
      vm.form = { ...vm.form, type: 'MULTIPLE' }
      await nextTick()
      expect(vm.form.answer).toBe('')
      expect(vm.answerArray).toEqual([])
    })

    it('多选答案变化时应该自动排序保存', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      vm.form = { ...vm.form, type: 'MULTIPLE' }
      await nextTick()
      vm.answerArray = ['C', 'A', 'B']
      await nextTick()
      expect(vm.form.answer).toBe('ABC')
    })

    it('多选答案变化时应该正确排序（D, B, A, C -> ABCD）', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      vm.form = { ...vm.form, type: 'MULTIPLE' }
      await nextTick()
      vm.answerArray = ['D', 'B', 'A', 'C']
      await nextTick()
      expect(vm.form.answer).toBe('ABCD')
    })
  })

  describe('提交功能', () => {
    it('新增题目提交成功后应该调用addQuestion并重置', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      vm.isEdit = false
      vm.form = {
        id: null,
        type: 'SINGLE',
        content: '新题目',
        optionA: 'A',
        optionB: 'B',
        optionC: 'C',
        optionD: 'D',
        answer: 'A',
        score: 10
      }
      vm.formRef = {
        validate: vi.fn(() => Promise.resolve()),
        resetFields: vi.fn()
      }
      const expectedForm = { ...vm.form }
      const apiCallCount = api.getQuestions.mock.calls.length
      await vm.handleSubmit()
      await flushPromises()
      expect(api.addQuestion).toHaveBeenCalledWith(expectedForm)
      expect(vm.dialogVisible).toBe(false)
      expect(vm.currentPage).toBe(1)
      expect(api.getQuestions.mock.calls.length).toBe(apiCallCount + 1)
    })

    it('编辑题目提交成功后应该调用updateQuestion并重置', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      vm.isEdit = true
      vm.form = {
        id: 1,
        type: 'SINGLE',
        content: '修改后的题目',
        optionA: 'A',
        optionB: 'B',
        optionC: 'C',
        optionD: 'D',
        answer: 'B',
        score: 10
      }
      vm.formRef = {
        validate: vi.fn(() => Promise.resolve()),
        resetFields: vi.fn()
      }
      const expectedForm = { ...vm.form }
      const apiCallCount = api.getQuestions.mock.calls.length
      await vm.handleSubmit()
      await flushPromises()
      expect(api.updateQuestion).toHaveBeenCalledWith(expectedForm)
      expect(vm.dialogVisible).toBe(false)
      expect(vm.currentPage).toBe(1)
      expect(api.getQuestions.mock.calls.length).toBe(apiCallCount + 1)
    })

    it('提交时校验失败应该不调用API', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      vm.formRef = {
        validate: vi.fn(() => Promise.reject(new Error('校验失败'))),
        resetFields: vi.fn()
      }
      await vm.handleSubmit()
      await flushPromises()
      expect(api.addQuestion).not.toHaveBeenCalled()
      expect(api.updateQuestion).not.toHaveBeenCalled()
    })
  })

  describe('删除功能', () => {
    it('handleDelete确认后应该调用deleteQuestion', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      const row = { id: 1 }
      const apiCallCount = api.getQuestions.mock.calls.length
      await vm.handleDelete(row)
      await flushPromises()
      expect(api.deleteQuestion).toHaveBeenCalledWith(1)
      expect(vm.currentPage).toBe(1)
      expect(api.getQuestions.mock.calls.length).toBe(apiCallCount + 1)
    })

    it('handleDelete取消时不应该调用deleteQuestion', async () => {
      const { ElMessageBox } = await import('element-plus')
      ElMessageBox.confirm = vi.fn(() => Promise.reject())
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      const row = { id: 1 }
      const apiCallCount = api.deleteQuestion.mock.calls.length
      await vm.handleDelete(row)
      await flushPromises()
      expect(api.deleteQuestion.mock.calls.length).toBe(apiCallCount)
    })
  })

  describe('表格操作栏', () => {
    it('操作栏应该有fixed="right"属性', async () => {
      const wrapper = await mountComponent()
      const tableColumns = wrapper.findAllComponents({ name: 'ElTableColumn' })
      const actionColumn = tableColumns.find(col => col.props('label') === '操作')
      expect(actionColumn.props('fixed')).toBe('right')
    })

    it('操作栏应该包含编辑和删除按钮', async () => {
      const wrapper = await mountComponent()
      const vm = wrapper.vm
      vm.currentPage = 1
      vm.pageSize = 10
      await nextTick()
      const html = wrapper.html()
      expect(html).toContain('编辑')
      expect(html).toContain('删除')
    })
  })
})
