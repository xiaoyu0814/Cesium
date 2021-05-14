<template>
    <div class="footer">
        <div class="left-nav">
            <img src="../../assets/logo1.png" alt="星火科技.PNG" v-show="false">
            <span>5km</span>
        </div>
        <div class='right-nav'>
            <ul>
                <li>经度：{{coord.lat|numFilter}}</li>
                <li>纬度：{{coord.lon|numFilter}}</li>
                <li>海拔：{{coord.altitude}}米</li>
                <li>方向：{{coord.heading}}度</li>
                <li>视高：{{coord.height}}米</li>
                <!-- <button onclick="coorddd">显示</button> -->
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    filters: {
        numFilter (value) {
            let realVal = ''
            if (value) {
            // 截取当前数据到小数点后6位
                realVal = parseFloat(value).toFixed(6)
            } else {
                realVal = '--'
            }
            return realVal
        },
        // numFilter2 (value){
        //     let realVal = ''
        //     if (value) {
        //     // 截取当前数据到小数点后6位
        //         realVal = parseFloat(value).toFixed(1)
        //     } else {
        //         realVal = '--'
        //     }
        //     return realVal
        // }
        
    },

    props:[
        'coord'
    ],
}
</script>
<style scoped>
    .footer{
        color:white;
        font-size:15px;
        display:flex;
        justify-content:space-between;
        background-color:rgba(0, 0, 0, 0.9)
    }
    .left-nav{
        margin-left:20px;
    }
    .left-nav>img{
        vertical-align: middle;
        height: 24px;
    }
    .left-nav>span{
        margin:10px;
        margin-left: 100px;
    }
    .right-nav{
        margin-right:20px;
    }
    .right-nav>ul li{
        display: inline
    }
    .right-nav>ul>li+li{
        margin-left:15px;
    }
</style>