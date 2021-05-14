<template>
  <div class="tableContent">
    <Table
      ref="tablesMain"
      :data="tableCon"
      :columns="tableHeader"
      :disabled-hover="true"
      border
      @on-current-change="onCurrentChange"
      @on-select="onSelect"
      @on-select-cancel="onSelectCancel"
      @on-select-all="onSelectAll"
      @on-selection-change="onSelectionChange"
      @on-sort-change="onSortChange"
      @on-filter-change="onFilterChange"
      @on-row-click="onRowClick"
      @on-row-dblclick="onRowDblclick"
      @on-expand="onExpand"
      v-bind="$attrs"
    ></Table>
		<div class="mpage" v-if="showPage">
			<Page
				:total="total"
				:show-sizer="showSizer"
        :show-elevator="showElevator"
        :size="pageType"
				show-total
				:current="current"
				:page-size="pageSize"
				:page-size-opts="showSize"
				@on-change="pageChange"
				@on-page-size-change="pageSizeChange"
			>
				<span v-if="showSizer">共{{ total }}条，每页显示：</span>
				<span v-else>共{{ total }}条&nbsp;&nbsp;&nbsp;</span>
			</Page>
		</div>
  </div>
</template>
<script>
export default {
  name: 'pagedTable',
  props: {
    tableCon: {
      type: Array,
      required: true
    },
    tableHeader: {
      type: Array,
      required: true
		},
		total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    current: {
      type: Number,
      default: 1
    },
    showSizer: {
      type: Boolean,
      default: true
    },
    pageType: {
      type: String,
      default: 'small'
    },
    showElevator: {
      type: Boolean,
      default: true
    },
    showPage: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
			showSize: [5, 10, 15, 20],
		}
  },
  mounted() {},
  methods: {
    onCurrentChange(currentRow, oldCurrentRow) {
      this.$emit('on-current-change', currentRow, oldCurrentRow)
    },
    onSelect(selection, row) {
      this.$emit('on-select', selection, row)
    },
    onSelectCancel(selection, row) {
      this.$emit('on-select-cancel', selection, row)
    },
    onSelectAll(selection) {
      this.$emit('on-select-all', selection)
    },
    onSelectionChange(selection) {
      this.$emit('on-selection-change', selection)
    },
    onSortChange(column, key, order) {
      this.$emit('on-sort-change', column, key, order)
    },
    onFilterChange(row) {
      this.$emit('on-filter-change', row)
    },
    onRowClick(row, index) {
      this.$emit('on-row-click', row, index)
    },
    onRowDblclick(row, index) {
      this.$emit('on-row-dblclick', row, index)
    },
    onExpand(row, status) {
      this.$emit('on-expand', row, status)
		},
		pageChange(current) {
      this.$emit('pageChange', current)
    },
    pageSizeChange(pageSize) {
      this.$emit('pageSizeChange', pageSize)
    }
  }
}
</script>
<style lang="less">
.tableContent {
  .mpage {
    height: 55px;
    line-height: 55px;
    .ivu-page {
      float: right;
      .ivu-page-item-active {
        border: 1px solid #5bc0be;
        background: #5bc0be;
        a {
          color: #fff;
        }
      }
      .ivu-page-item {
        border-radius: 0;
      }
      .ivu-page-item:hover {
        border: 1px solid #5bc0be;
        background: #5bc0be;
        a {
          color: #fff;
        }
      }
      .ivu-page-total {
        float: left;
        margin-right: 0;
        line-height: 55px;
        span {
          font-size: 12px;
          color: #888888;
        }
      }
      .ivu-page-options {
        float: left;
        margin-left: 4px;
      }
    }
  }
  .ivu-table-wrapper {
    .ivu-table-body {
      .ivu-table-tbody {
        .ivu-table-row {
          td {
            height: 32px;
          }
        }
      }
    }
  }
  .op-item {
    text-align: center;
    cursor: pointer;
    margin-right: 4px;
    display: inline-block;
    background: linear-gradient(to bottom, #fafafa, #ebedef);
    border-color: @gray-4;
    color: @black-1;
    border-radius: 0;
    padding: 5px 14px;
    line-height: 1;
  }
}
</style>

