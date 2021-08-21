<template>
  <div class="home">
    <div class="home-title">自定义跑图自助工具</div>
    <div class="home-body">

    <div class="step-tip">第 1/4 步 选择需要的地图跑法</div>
    <div class="select-running-wrapper">
      <div
        class="select-running-block"
        v-for="(mapItem, index) in myMap"
        :key="index"
      >
        <input
          class="running-checkbox"
          type="checkbox"
          :id="'map-item-' + index"
          :value="index"
          v-model="checkedRunnings"
        />
        <label class="running-checkbox-label" :for="'map-item-' + index">
          <div class="running-checkbox-title">{{ mapItem.mapName }}</div>
          <div class="running-checkbox-date">
            {{ mapItem.date || "未知" }}
          </div>
          <div class="running-checkbox-note">
            {{ mapItem.note || "暂无描述" }}
          </div>
        </label>
      </div>
    </div>

    <div class="step-tip">第 2/4 步 复制跑法代码</div>

    <!-- Target -->
    <div class="my-map-txt">{{ myMapTxt }}</div>

    <div class="duplicate-map-name-alert" v-if="duplicateMapName !== ''">
      你选择了重复的地图名：{{
        duplicateMapName
      }}。将会导致跑法覆盖！建议只保留一个同名地图。
    </div>

    <div class="selected-map-name-list" v-else>
      已选择的跑法：{{ mapNameSelected | showArray }}。
    </div>
    <!-- Trigger -->
    <button
      class="copy-btn"
      :class="{ 'copy-btn-copyed': inCopyedTime }"
      :disabled="inCopyedTime"
      ref="copyBtn"
      :data-clipboard-text="myMapTxt"
    >
      {{ copyBtnTxt }}
    </button>

    <div class="step-tip">第 3/4 步 粘贴到 my_map.txt 中</div>
    <div class="help-text">文件路径：<span class="highlight">/var/mobile/Media/TouchSprite/log/my_map.txt</span></div>
    <div class="step-tip">第 4/4 步 启动并配置 🦶</div>
    <div class="help-text">基本设置：勾选“自定义地图”</div>
    <div class="help-text">寻车设置（或生涯等其他模式设置）：填写对应的地图名称。（多人模式无需填写）</div>
    </div>
  </div>
</template>

<script>
import myMap from "@/data/my_map.js";
import ClipboardJS from "clipboard";

const defaultCopyBtnTxt = "复制内容到剪贴板";

export default {
  name: "Home",
  data() {
    return {
      myMap,
      clipboard: null,
      copyBtnTxt: defaultCopyBtnTxt,
      inCopyedTime: false,
      checkedRunnings: [0],
    };
  },
  computed: {
    runningsSelected() {
      console.log(this.checkedRunnings);
      return this.myMap.filter(
        (item, index) =>
          this.checkedRunnings.findIndex((value) => value === index) !== -1
      );
    },
    mapNameSelected() {
      return this.runningsSelected.map((running) => running.mapName);
    },
    duplicateMapName() {
      console.log(this.mapNameSelected);
      let length = this.mapNameSelected.length;
      for (let i = 1; i < length; i++) {
        if (
          this.mapNameSelected
            .slice(0, i)
            .findIndex((item) => item === this.mapNameSelected[i]) !== -1
        ) {
          return this.mapNameSelected[i];
        }
      }
      return "";
    },
    myMapTxt() {
      let obj = this.runningsSelected
        .slice()
        .reverse()
        .reduce(
          (prev, curr) => ({ ...prev, [curr.mapName]: curr.runningArray }),
          {}
        );
      return JSON.stringify(obj);
    },
  },
  filters: {
    showArray(array) {
      return array.join("、");
    },
  },
  mounted() {
    this.clipboard = new ClipboardJS(this.$refs.copyBtn);
    let that = this;
    this.clipboard.on("success", () => {
      this.inCopyedTime = true;
      that.onCopyed(3);
    });
  },
  methods: {
    onCopyed(num) {
      if (!num > 0) {
        this.copyBtnTxt = defaultCopyBtnTxt;
        this.inCopyedTime = false;
        return;
      }
      this.copyBtnTxt = `已复制！（${num}秒）`;
      let that = this;
      setTimeout(() => {
        that.onCopyed(num - 1);
      }, 1000);
    },
  },
};
</script>

<style scoped>
.home-title{
  font-size: 20px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  padding:32px 0;
  color:#fff;
  background-color: rgb(10, 139, 214);
}
.home-body {
  max-width: 514px;
  margin: 0 auto;
  padding: 10px;
  padding-bottom: 40px;
}
.step-tip {
  font-size: 14px;
  font-weight: bold;
  border-left: 5px solid rgb(32, 115, 224);
  padding-left: 8px;
  margin: 15px 0;
  color: rgb(32, 115, 224);
}
.my-map-txt {
  word-wrap: break-word;
  word-break: break-all;
  /* background-color: rgb(175, 231, 216); */
  border-radius: 5px;
  border: 2px solid rgb(29, 194, 111);
  padding: 10px;
  margin-bottom: 10px;
  max-height: 38vh;
  overflow-y: auto;
}
.copy-btn {
  width: 100%;
  font-size: 18px;
  padding: 15px 0;
  border-radius: 10px;
  background-color: rgb(29, 194, 111);
  margin-bottom: 10px;
  border: none;
  color: #fff;
  /* transition: all 0.5s; */
}
.select-running-wrapper {
  margin-bottom: 10px;
}
.running-checkbox-label {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
}
.select-running-block + .select-running-block {
  margin-top: 20px;
}
.running-checkbox:checked + .running-checkbox-label {
  background-color: rgb(161, 225, 245);
}
.running-checkbox-title {
  font-size: 18px;
  color: #303030;
}
.running-checkbox:checked + .running-checkbox-label > .running-checkbox-title {
  font-weight: bold;
  color: #000;
}
.running-checkbox-date {
  color: #303030;
  justify-self: end;
}
.running-checkbox-note {
  font-size: 14px;
  margin-top: 5px;
  grid-column-start: 1;
  grid-column-end: 3;
  color: #606060;
}
.selected-map-name-list,
.duplicate-map-name-alert {
  margin-bottom: 10px;
  background-color: rgb(215, 240, 200);
  padding: 5px;
  border-radius: 4px;
}
.duplicate-map-name-alert {
  background-color: crimson;
  color: #fff;
}
.help-text+.help-text{
  margin-top: 10px;
}
.highlight{
  line-height: 1.7em;
  border-bottom:2px solid rgb(32, 94, 226);
  word-break: break-all;
  padding:2px 5px;
}
</style>