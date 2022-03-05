<template>
  <div id="publicsentiment">
    <!-- 页面 -->
    <div v-if="ceng == 0">
      <jiance />
    </div>
    <div v-if="ceng == 1">
      <sentimentAnalysis />
    </div>
    <div v-if="ceng == 2">
      <timeSeriesanalysis />
    </div>
    <!-- 导航 -->
    <div class="jump">
      <p class="switch" @click="switchs()">
        <i :class="iocs.ioc" />
      </p>
      <ul class="lu">
        <!-- 误删第一个 -->
        <li>
          <icon-svg icon-class="icon-yuqingjiance" class="img" />
          <div class="jie">舆情监测</div>
        </li>
        <!-- 复制中间的 -->
        <li>
          <icon-svg icon-class="icon-qingganfenxi" class="img" />
          <div class="jie">区域情感分析</div>
        </li>
        <!-- 误删最后一个 -->
        <li>
          <icon-svg icon-class="icon-shixufenxi" class="img" />
          <div class="jie">舆情时序分析</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Jiance from './components/jiance'
import SentimentAnalysis from './components/sentimentAnalysis'
import TimeSeriesanalysis from './components/timeSeriesanalysis'

export default {
  name: 'Publicsentiment',
  components: {
    Jiance,
    SentimentAnalysis,
    TimeSeriesanalysis
  },
  data() {
    return {
      iocs: {
        ioc: 'el-icon-upload2',
        id: 0
      },
      ceng: 0
    }
  }, destroyed() {
    document.getElementsByClassName('jump')[0].style.display = 'none'
  },
  mounted() {
    var that = this
    const buttons = document.querySelectorAll('.lu li')
    buttons.forEach((button, index) => {
      button.addEventListener('mouseover', () => {
        if (index > 0) {
          const prevTooltip = buttons[index - 1].querySelector('.jie')
          prevTooltip.classList.remove('animate-right')
          prevTooltip.classList.add('animate-left')
          document.getElementsByClassName('switch')[0].style.display = 'none'
        }
        if (index < buttons.length - 1) {
          const nextTooltip = buttons[index + 1].querySelector('.jie')
          nextTooltip.classList.remove('animate-left')
          nextTooltip.classList.add('animate-right')
          document.getElementsByClassName('switch')[0].style.display = 'none'
        }
      })
      button.addEventListener('mouseout', () => {
        document.getElementsByClassName('switch')[0].style.display = 'block'
      })
      button.addEventListener('click', () => {
        that.ceng = index
      })
    })
    setTimeout(function() {
      document.getElementsByClassName('jump')[0].style.display = 'block'
    }, 1000)
  },
  methods: {
    switchs() {
      var that = this
      if (that.iocs.id === 0) {
        that.iocs.id = 1
        that.iocs.ioc = 'el-icon-download'
        document.getElementsByClassName('jump')[0].style.bottom = '0'
        document.getElementsByClassName('switch')[0].style.backgroundColor = 'rgba(255, 255, 255, 1)'
      } else {
        that.iocs.id = 0
        that.iocs.ioc = 'el-icon-upload2'
        document.getElementsByClassName('jump')[0].style.bottom = '-75px'
        document.getElementsByClassName('switch')[0].style.backgroundColor = 'rgba(255, 255, 255, 0.6)'
      }
    }
  }
}
</script>
<style scoped>
@font-face {
  src: url("./components/public/font/KuHei.ttf");
  font-family: "KuHei";
}
#publicsentiment {
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>
<style scoped>
.jump {
  display: grid;
  place-items: center;
  position: absolute;
  bottom: -75px;
  left: 50%;
  transform: translate(-50%, 0);
  transition: all 1.5s;
  display: none;
  z-index: 9999;
}
.jump .switch {
  position: absolute;
  top: -14.8px;
  left: 50%;
  transform: translate(-50%, 0);
  margin: 0;
  padding: 0;
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.6);
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  border: 0.5px solid rgba(146, 152, 176, 0.4);
  box-shadow: 0px 0px 10px rgb(255 255 255 / 40%), 0px -6px 20px 5px rgb(255 255 255 / 30%);
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
	animation: fade-in .5s;
}
.jump .switch i {
  transition: all 0.5s linear;
}
.jump .switch:hover i {
	/* animation: rotate 5s linear infinite; */
  transform: scale(1.2);
  transition: all 0.5s linear;
}
.jump ul {
  padding: 8px 10px;
  border-radius: 50px;
  background: #fff;
  border: 0.5px solid rgba(146, 152, 176, 0.4);
  box-shadow: 0 0 10px rgb(255 255 255 / 70%), 4px 4px 10px rgb(255 255 255 / 40%);
  cursor: default;
}
.jump ul .img {
  font-size: 22px;
}
.jump ul li {
  display: inline-block;
  vertical-align: top;
  border: 0 solid transparent;
  background: transparent;
  padding: 10px 30px;
  margin: 0 -2px;
  color: #273043;
  font-size: 17px;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  top: 0;
  left: 0;
  outline: none;
  transition: background 0.2s ease-in-out;
}
.jump ul li:first-child {
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
}
.jump ul li:last-child {
  border-top-right-radius: 40px;
  border-bottom-right-radius: 40px;
}
.jump ul li div {
  position: absolute;
  top: -43px;
  left: calc(50% - 55px);
  width: 110px;
  font-size: 13px;
  color: rgb(255, 255, 255);
  background: rgba(133, 122, 122, 0.877);
  /* font-weight: bold; */
  border-radius: 16px;
  line-height: 30px;
  font-family: 'Raleway', Arial, sans-serif;
  text-align: center;
  letter-spacing: 1px;
  box-shadow: 0 0 5px rgba(39, 48, 68, 0.3), 1px 1px 5px rgba(39, 48, 68, 0.2);
  display: none;
  cursor: pointer;
  font-family: KuHei;
}
.jump ul li:hover {
  background: #dadbdf;
}
.jump ul li:hover div {
  display: block;
  animation: tooltip-animation-normal 0.3s ease-out forwards;
}
.jump ul li:hover div.animate-right {
  animation: tooltip-animation-right 0.3s ease-out forwards;
}
.jump ul li:hover div.animate-left {
  animation: tooltip-animation-left 0.3s ease-out forwards;
}
.jump ul li:active {
  outline: none;
  background: #d6d8e1;
}
@keyframes tooltip-animation-right {
  0% {
    transform: translateX(-75px);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes tooltip-animation-left {
  0% {
    transform: translateX(75px);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes tooltip-animation-normal {
  0% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}
/*动画*/
@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
@keyframes fade-in {
  0% {
    opacity: 0;
  }

  /*初始状态 透明度为0*/
  40% {
    opacity: 0;
  }

  /*过渡状态 透明度为0*/
  100% {
    opacity: 1;
  }

  /*结束状态 透明度为1*/
}
</style>

