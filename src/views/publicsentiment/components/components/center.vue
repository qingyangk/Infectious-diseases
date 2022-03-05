<template>
  <div id="center">
    <div id="xiu" />
    <!-- 上 -->
    <div class="top">
      <ul>
        <li>
          <hotwords />
        </li>
      </ul>
    </div>
    <!-- 中 -->
    <div class="center">
      <ul>
        <li style="left: 10px;width: calc((100% - 30px) / 3 * 1 )">
          <hotsearch />
        </li>
        <li style="left: calc(50% - 10px);transform: translate(calc(-50% + 10px), 0);width: calc((100% - 30px) / 3 * 1 )">
          <frontHotsearch />
        </li>
        <li style="right: 10px;width: calc((100% - 30px) / 3 * 1 )">
          <negativeHotsearch />
        </li>
      </ul>
    </div>
    <!-- 下 -->
    <div class="botton">
      <ul>
        <li style="width: calc((100% - 22px) / 3 * 2 )">
          <hotsearchDistribution />
        </li>
        <li style="right: 10px;width: calc((100% - 30px) / 3 * 1 )">
          <proportionHotsearch />
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Hotwords from './hotwords'
import Hotsearch from './hotsearch'
import FrontHotsearch from './frontHotsearch'
import NegativeHotsearch from './negativeHotsearch'
import HotsearchDistribution from './hotsearchDistribution'
import ProportionHotsearch from './proportionHotsearch'

export default {
  name: 'Center',
  components: {
    Hotwords,
    Hotsearch,
    FrontHotsearch,
    NegativeHotsearch,
    HotsearchDistribution,
    ProportionHotsearch
  }
}
</script>
<style scoped>
#center {
  position: absolute;
  height: calc(100% - 20px);
  width: calc(100% - 10px);
  border: 4px solid rgba(40, 41, 44, .5);
}
#center::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  width: 15px;
  height: 15px;
  border-top: 2px solid #cccfff;
  border-left: 2px solid #cccfff;
}
#center::before {
  content: '';
  position: absolute;
  top: -4px;
  right: -4px;
  width: 15px;
  height: 15px;
  border-top: 2px solid #cccfff;
  border-right: 2px solid #cccfff;
}
#xiu::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: -4px;
  width: 15px;
  height: 15px;
  border-bottom: 2px solid #cccfff;
  border-left: 2px solid #cccfff;
}
#xiu::before {
  content: '';
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 15px;
  height: 15px;
  border-bottom: 2px solid #cccfff;
  border-right: 2px solid #cccfff;
}
/* 头 */
#center .top {
  position: absolute;
  width: 100%;
  height: 50%;
  top: 0;
  padding: 5px 10px;
}
#center .top ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
#center .top ul li {
  position: absolute;
  display: inline-block;
  vertical-align: top;
  height: calc(100% - 10px);
  background: rgba(40, 41, 44, .5);
  width: calc(100% - 20px);
}
/* 中 */
#center .center {
  position: absolute;
  width: 100%;
  height: 25%;
  top: 50%;
  padding: 5px 10px;
}
#center .center ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
#center .center ul li {
  position: absolute;
  display: inline-block;
  vertical-align: top;
  height: calc(100% - 10px);
  z-index: 1;
  background: rgba(40, 41, 44, .5);
}
/* 尾 */
#center .botton {
  position: absolute;
  width: 100%;
  height: 25%;
  bottom: 0;
  padding: 5px 10px;
}
#center .botton ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
#center .botton ul li {
  position: absolute;
  display: inline-block;
  vertical-align: top;
  height: calc(100% - 10px);
  background: rgba(40, 41, 44, .5);
}
</style>
