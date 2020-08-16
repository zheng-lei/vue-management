<template>
    <div class="storage-wrap">
        <el-upload
         :action='"http://118.25.93.129:8083/api/v1/storages/upload/" + this.filetype'
         :headers="{'Authorization': header}"
         :file-list='fileList'>
            <el-button size='small' type='primary'>点击上传</el-button>
        </el-upload>
    </div>
</template>

<script>
export default {
    name: 'Storage',
    data() {
        return {
            filetype: "test-type",
            header: 'Bearer ' + window.sessionStorage.getItem('access_token'),
            fileList: []
        }
    }
}
</script>

<style lang="less" scoped>
    .storage-wrap {
        padding: 20px;
    }
</style>