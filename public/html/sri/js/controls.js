class Controls {
  constructor(simBasicCallback, simCentralCallback, simCommunityCallback,
    lessInteractionPresetCallback, moreInteractionPresetCallback,
    betterHygienePresetCallback, worseHygienePresetCallback,
    shorterInfDurPresetCallback, longerInfDurPresetCallback,
    higherTestPropPresetCallback, lowerTestPropPresetCallback,
    fullSocDistPresetCallback, someSocDistPresetCallback,
    restrictComCrossPresetCallBack, unrestrictComCrossPresetCallBack,
    smallSpaceLessPeoplePresetCallback, smallSpaceMorePeoplePresetCallback) {

    this.simBasicBtn = this.makeSimBtn("简单场景", "chooseASimInp")
    this.simCentralBtn = this.makeSimBtn("密接场所", "chooseASimInp")
    this.simCommunityBtn = this.makeSimBtn("社区隔离", "chooseASimInp")
    this.simBtns = [this.simBasicBtn, this.simCentralBtn, this.simCommunityBtn]
    this.simBasicBtn.mousePressed(this.simBtnCallback(simBasicCallback, this.simBasicBtn, this.simBtns))
    this.simCentralBtn.mousePressed(this.simBtnCallback(simCentralCallback, this.simCentralBtn, this.simBtns))
    this.simCommunityBtn.mousePressed(this.simBtnCallback(simCommunityCallback, this.simCommunityBtn, this.simBtns))

    this.presetLessInteractionBtn = this.makePresetBtn("互动减少", "dailyInteractionsPreset")
    this.presetLessInteractionBtn.mousePressed(lessInteractionPresetCallback)
    this.presetMoreInteractionBtn = this.makePresetBtn("互动增加", "dailyInteractionsPreset")
    this.presetMoreInteractionBtn.mousePressed(moreInteractionPresetCallback)

    this.presetBetterHygieneBtn = this.makePresetBtn("注意卫生", "hygienePreset")
    this.presetBetterHygieneBtn.mousePressed(betterHygienePresetCallback)
    this.presetWorseHygieneBtn = this.makePresetBtn("不注意卫生", "hygienePreset")
    this.presetWorseHygieneBtn.mousePressed(worseHygienePresetCallback)

    this.presetShorterInfDurBtn = this.makePresetBtn("短期疾病", "illnessDurationPreset")
    this.presetShorterInfDurBtn.mousePressed(shorterInfDurPresetCallback)
    this.presetLongerInfDurBtn = this.makePresetBtn("长期疾病", "illnessDurationPreset")
    this.presetLongerInfDurBtn.mousePressed(longerInfDurPresetCallback)

    this.presetHigherTestPropBtn = this.makePresetBtn("增加测试", "testCoveragePreset")
    this.presetHigherTestPropBtn.mousePressed(higherTestPropPresetCallback)
    this.presetLowerTestPropBtn = this.makePresetBtn("减少测试", "testCoveragePreset")
    this.presetLowerTestPropBtn.mousePressed(lowerTestPropPresetCallback)

    this.fullSocDistBtn = this.makePresetBtn("全部人员保持社交距离", "socialDistancingPreset")
    this.fullSocDistBtn.mousePressed(fullSocDistPresetCallback)
    this.someSocDistBtn = this.makePresetBtn("部分人忽视了社交距离", "socialDistancingPreset")
    this.someSocDistBtn.mousePressed(someSocDistPresetCallback)

    this.resComCrossBtn = this.makePresetBtn("限制社区间过境", "limitedTransitPreset")
    this.resComCrossBtn.mousePressed(restrictComCrossPresetCallBack)
    this.unresComCrossBtn = this.makePresetBtn("不限制社区间过境", "limitedTransitPreset")
    this.unresComCrossBtn.mousePressed(unrestrictComCrossPresetCallBack)

    this.smlSpcLessPplBtn = this.makePresetBtn("空间小，人少", "smallSpacePreset")
    this.smlSpcLessPplBtn.mousePressed(smallSpaceLessPeoplePresetCallback)
    this.smlSpcMorePplBtn = this.makePresetBtn("空间小，人多", "smallSpacePreset")
    this.smlSpcMorePplBtn.mousePressed(smallSpaceMorePeoplePresetCallback)

    this.dontOverrideSettingsCb = this.makeCheckbox("更改模型时不重置设置！", "dontOverrideSettingsCb", false)

    // Destructuring directly into variable is unstable and causes some objects to be undefined
    let group = this.makeSliderGroup(
      "人数: ", "(不影响社区人数)",
      "popSizeTxt",
      "popSizeInp",
      POPULATION_SIZE_MIN,
      POPULATION_SIZE_MAX,
      POPULATION_SIZE_DEFAULT,
      POPULATION_SIZE_STEP)
    this.popSizeSlider = group[0]
    this.popSizeLabel = group[1]

    group = this.makeSliderGroup(
      "每个社区的人数: ", "(重置时应用)",
      "comSizeTxt",
      "comSizeInp",
      COMMUNITY_SIZE_MIN,
      COMMUNITY_SIZE_MAX,
      COMMUNITY_SIZE_DEFAULT,
      COMMUNITY_SIZE_STEP)
    this.comSizeSlider = group[0]
    this.comSizeLabel = group[1]

    group = this.makeSliderGroup(
      "社会距离因素: ", "(人们彼此之间的距离有多远)",
      "sdistancingTxt",
      "sdistancingInp",
      SOCIAL_DISTANCE_FACTOR_MIN,
      SOCIAL_DISTANCE_FACTOR_MAX,
      SOCIAL_DISTANCE_FACTOR_DEFAULT,
      SOCIAL_DISTANCE_FACTOR_STEP)
    this.sDistSlider = group[0]
    this.sDistLabel = group[1]

    group = this.makeSliderGroup(
      "% 忽视社交距离的人: ", "(与他人不保持相应的距离)",
      "isdistancingTxt",
      "isdistancingInp",
      SOCIAL_DISTANCE_IGNORE_MIN,
      SOCIAL_DISTANCE_IGNORE_MAX,
      SOCIAL_DISTANCE_IGNORE_DEFAULT,
      SOCIAL_DISTANCE_IGNORE_STEP)
    this.igSDistSlider = group[0]
    this.igSDistLabel = group[1]

    group = this.makeSliderGroup(
      "感染半径: ", "(越低意味着与他人的互动越少)",
      "infectionRadiusTxt",
      "infectionRadiusInp",
      INFECTION_RADIUS_MIN,
      INFECTION_RADIUS_MAX,
      INFECTION_RADIUS_DEFAULT,
      INFECTION_RADIUS_STEP)
    this.infRadSlider = group[0]
    this.infRadLabel = group[1]

    group = this.makeSliderGroup(
      "每日感染机会: ", "(较低意味着更好的卫生，例如经常洗手、戴口罩)",
      "infectionChanceTxt",
      "infectionChanceInp",
      INFECTION_CHANCE_MIN,
      INFECTION_CHANCE_MAX,
      INFECTION_CHANCE_DEFAULT,
      INFECTION_CHANCE_STEP)
    this.infChanceSlider = group[0]
    this.infChanceLabel = group[1]

    group = this.makeSliderGroup(
      "初次感染机会: ", "(适用于复位)",
      "initialPopInfTxt",
      "initialPopInfInp",
      INFECTION_INITIAL_PROPORTION_MIN,
      INFECTION_INITIAL_PROPORTION_MAX,
      INFECTION_INITIAL_PROPORTION_DEFAULT,
      INFECTION_INITIAL_PROPORTION_STEP)
    this.infPopInitSlider = group[0]
    this.infPopInitLabel = group[1]

    group = this.makeSliderGroup(
      "感染性，无症状持续时间: ", "(天)",
      "inf1DurationTxt",
      "inf1DurationInp",
      INFECTIOUS1_DURATION_MIN,
      INFECTIOUS1_DURATION_MAX,
      INFECTIOUS1_DURATION_DEFAULT,
      INFECTIOUS1_DURATION_STEP)
    this.inf1DurationSlider = group[0]
    this.inf1DurationLabel = group[1]

    group = this.makeSliderGroup(
      "感染性症状持续时间: ", "(天)",
      "inf2DurationTxt",
      "inf2DurationInp",
      INFECTIOUS2_DURATION_MIN,
      INFECTIOUS2_DURATION_MAX,
      INFECTIOUS2_DURATION_DEFAULT,
      INFECTIOUS2_DURATION_STEP)
    this.inf2DurationSlider = group[0]
    this.inf2DurationLabel = group[1]

    group = this.makeSliderGroup(
      "中心位置访问间隔: ", `(访问时间间隔)`,
      "cenVisitIntTxt",
      "cenVisitIntInp",
      CENTRAL_LOC_VISIT_INTERVAL_MIN,
      CENTRAL_LOC_VISIT_INTERVAL_MAX,
      CENTRAL_LOC_VISIT_INTERVAL_DEFAULT,
      CENTRAL_LOC_VISIT_INTERVAL_STEP)
    this.cenVisitIntSlider = group[0]
    this.cenVisitIntLabel = group[1]

    group = this.makeSliderGroup(
      "中心位置休假间隔: ", "(两人离开的时间间隔)",
      "cenLeaveIntTxt",
      "cenLeaveIntInp",
      CENTRAL_LOC_LEAVE_INTERVAL_MIN,
      CENTRAL_LOC_LEAVE_INTERVAL_MAX,
      CENTRAL_LOC_LEAVE_INTERVAL_DEFAULT,
      CENTRAL_LOC_LEAVE_INTERVAL_STEP)
    this.cenLeaveIntSlider = group[0]
    this.cenLeaveIntLabel = group[1]

    group = this.makeSliderGroup(
      "社区穿越间隔: ", "(跨越社区的时间长度)",
      "comCrossIntTxt",
      "comCrossIntInp",
      COMMUNITIES_CROSSING_INTERVAL_MIN,
      COMMUNITIES_CROSSING_INTERVAL_MAX,
      COMMUNITIES_CROSSING_INTERVAL_DEFAULT,
      COMMUNITIES_CROSSING_INTERVAL_STEP)
    this.comCrossIntSlider = group[0]
    this.comCrossIntLabel = group[1]

    this.quarantineSymptomsCb = this.makeCheckbox("出现症状时隔离", "quarantineWithSymptomsCb", QUARANTINE_WITH_SYMPTOMS_DEFAULT)

    group = this.makeSliderGroup(
      "出现症状后推迟隔离: ", "(天)",
      "quarantineWithSymptomsDelayTxt",
      "quarantineWithSymptomsDelayInp",
      QUARANTINE_WITH_SYMPTOMS_DELAY_MIN,
      QUARANTINE_WITH_SYMPTOMS_DELAY_MAX,
      QUARANTINE_WITH_SYMPTOMS_DELAY_DEFAULT,
      QUARANTINE_WITH_SYMPTOMS_DELAY_STEP)
    this.qwsDelaySlider = group[0]
    this.qwsDelayLabel = group[1]

    group = this.makeSliderGroup(
      "% 每日随机检测的人: ", "(检测呈阳性者立即被隔离)",
      "testPropTxt",
      "testPropInp",
      TEST_PROP_MIN,
      TEST_PROP_MAX,
      TEST_PROP_DEFAULT,
      TEST_PROP_STEP)
    this.testPropSlider = group[0]
    this.testPropLabel = group[1]

    group = this.makeSliderGroup(
      "模拟速度: ", "(模型的运行速度)",
      "simSpeedTxt",
      "simSpeedInp",
      SIM_SPEED_MIN,
      SIM_SPEED_MAX,
      SIM_SPEED_DEFAULT,
      SIM_SPEED_STEP)
    this.simSpeedSlider = group[0]
    this.simSpeedLabel = group[1]

    group = this.makeSliderGroup(
      "可同时治疗的人数: ", "(医院可治疗的人数)",
      "hospResTxt",
      "hospResInp",
      HOSPITAL_RESOURCES_MIN,
      HOSPITAL_RESOURCES_MAX,
      HOSPITAL_RESOURCES_DEFAULT,
      HOSPITAL_RESOURCES_STEP)
    this.hospResSlider = group[0]
    this.hospResLabel = group[1]

    group = this.makeSliderGroup(
      "未经治疗的每日死亡几率: ", "(治疗只在隔离区可用)",
      "deathChanceTxt",
      "deathChanceInp",
      INFECTION_UNTREATED_DEATH_RATE_MIN,
      INFECTION_UNTREATED_DEATH_RATE_MAX,
      INFECTION_UNTREATED_DEATH_RATE_DEFAULT,
      INFECTION_UNTREATED_DEATH_RATE_STEP)
    this.deathChanceSlider = group[0]
    this.deathChanceLabel = group[1]

    group = this.makeSliderGroup(
      "% 接种疫苗的人数: ", "(仅适用于易受感染者，可忽略每日感染机会)",
      "vaccinationTxt",
      "vaccinationInp",
      VACCINATION_RATE_MIN,
      VACCINATION_RATE_MAX,
      VACCINATION_RATE_DEFAULT,
      VACCINATION_RATE_STEP)
    this.vaccinationSlider = group[0]
    this.vaccinationLabel = group[1]
  }

  /**
   * 
   * @param {Integer} sNum Simulation Number
   */
  reset(sNum, sync = true) {
    this.quarantineSymptomsCb.checked(QUARANTINE_WITH_SYMPTOMS_DEFAULT)

    this.popSizeSlider.value(POPULATION_SIZE_DEFAULT)
    this.comSizeSlider.value(COMMUNITY_SIZE_DEFAULT)
    this.sDistSlider.value(SOCIAL_DISTANCE_FACTOR_DEFAULT)
    this.igSDistSlider.value(SOCIAL_DISTANCE_IGNORE_DEFAULT)

    if (sNum == SIM_COMMUNITIES) {
      this.infRadSlider.value(COMMUNITIES_INFECTION_RADIUS)
    }
    else if (sNum == SIM_CENTRAL) this.infRadSlider.value(CENTRAL_LOC_INFECTION_RADIUS)
    else this.infRadSlider.value(INFECTION_RADIUS_DEFAULT)

    this.infChanceSlider.value(INFECTION_CHANCE_DEFAULT)
    this.infPopInitSlider.value(INFECTION_INITIAL_PROPORTION_DEFAULT)
    this.inf1DurationSlider.value(INFECTIOUS1_DURATION_DEFAULT)
    this.inf2DurationSlider.value(INFECTIOUS2_DURATION_DEFAULT)
    this.cenVisitIntSlider.value(CENTRAL_LOC_VISIT_INTERVAL_DEFAULT)
    this.cenLeaveIntSlider.value(CENTRAL_LOC_LEAVE_INTERVAL_DEFAULT)
    this.comCrossIntSlider.value(COMMUNITIES_CROSSING_INTERVAL_DEFAULT)
    this.testPropSlider.value(TEST_PROP_DEFAULT)
    this.simSpeedSlider.value(SIM_SPEED_DEFAULT)
    this.hospResSlider.value(HOSPITAL_RESOURCES_DEFAULT)
    this.deathChanceSlider.value(INFECTION_UNTREATED_DEATH_RATE_DEFAULT)
    this.qwsDelaySlider.value(QUARANTINE_WITH_SYMPTOMS_DELAY_DEFAULT)
    this.vaccinationSlider.value(VACCINATION_RATE_DEFAULT)

    if (sync) this.syncSimWithSettings()
  }

  /**
   * Calls every callback to ensure that all settings have been applied
   */
  syncSimWithSettings() {
    this.popSizeCallback()
    this.comSizeCallback()
    this.sDistCallback()
    this.igSDistCallback()
    this.infRadCallback()
    this.infChanceCallback()
    this.infPopInitCallback()
    this.inf1DurationCallback()
    this.inf2DurationCallback()
    this.cenVisitIntCallback()
    this.cenLeaveIntCallback()
    this.comCrossIntCallback()
    this.testPropCallback()
    this.simSpeedCallback()
    this.hospResCallback()
    this.deathChanceCallback()
    this.qwsDelayCallback()
    this.vaccinationCallback()
  }

  /**
   * Update callbacks to update the correct Objects
   * @param {Simulation} sim The current Simulation
   */
  updateCallbacks(sim) {
    this.popSizeCallback = this.popSizeCallbackHOF(this.popSizeSlider, this.popSizeLabel)
    this.popSizeSlider.changed(this.popSizeCallback)

    this.comSizeCallback = this.comSizeCallbackHOF(this.comSizeSlider, this.comSizeLabel)
    this.comSizeSlider.changed(this.comSizeCallback)

    this.sDistCallback = this.sDistCallbackHOF(this.sDistSlider, this.sDistLabel)
    this.sDistSlider.changed(this.sDistCallback)

    this.igSDistCallback = this.igSDistCallbackHOF(this.igSDistSlider, this.igSDistLabel, sim)
    this.igSDistSlider.changed(this.igSDistCallback)

    this.infRadCallback = this.infRadCallbackHOF(this.infRadSlider, this.infRadLabel)
    this.infRadSlider.changed(this.infRadCallback)

    this.infChanceCallback = this.infChanceCallbackHOF(this.infChanceSlider, this.infChanceLabel)
    this.infChanceSlider.changed(this.infChanceCallback)

    this.infPopInitCallback = this.infPopInitCallbackHOF(this.infPopInitSlider, this.infPopInitLabel)
    this.infPopInitSlider.changed(this.infPopInitCallback)

    this.inf1DurationCallback = this.inf1DurationCallbackHOF(this.inf1DurationSlider, this.inf1DurationLabel)
    this.inf1DurationSlider.changed(this.inf1DurationCallback)

    this.inf2DurationCallback = this.inf2DurationCallbackHOF(this.inf2DurationSlider, this.inf2DurationLabel)
    this.inf2DurationSlider.changed(this.inf2DurationCallback)

    this.cenVisitIntCallback = this.cenVisitIntCallbackHOF(this.cenVisitIntSlider, this.cenVisitIntLabel)
    this.cenVisitIntSlider.changed(this.cenVisitIntCallback)

    this.cenLeaveIntCallback = this.cenLeaveIntCallbackHOF(this.cenLeaveIntSlider, this.cenLeaveIntLabel)
    this.cenLeaveIntSlider.changed(this.cenLeaveIntCallback)

    this.comCrossIntCallback = this.comCrossIntCallbackHOF(this.comCrossIntSlider, this.comCrossIntLabel)
    this.comCrossIntSlider.changed(this.comCrossIntCallback)

    this.testPropCallback = this.testPropCallbackHOF(this.testPropSlider, this.testPropLabel)
    this.testPropSlider.changed(this.testPropCallback)

    this.simSpeedCallback = this.simSpeedCallbackHOF(this.simSpeedSlider, this.simSpeedLabel)
    this.simSpeedSlider.changed(this.simSpeedCallback)

    this.hospResCallback = this.hospResCallbackHOF(this.hospResSlider, this.hospResLabel)
    this.hospResSlider.changed(this.hospResCallback)

    this.deathChanceCallback = this.deathChanceCallbackHOF(this.deathChanceSlider, this.deathChanceLabel)
    this.deathChanceSlider.changed(this.deathChanceCallback)

    this.qwsDelayCallback = this.qwsDelayCallbackHOF(this.qwsDelaySlider, this.qwsDelayLabel)
    this.qwsDelaySlider.changed(this.qwsDelayCallback)

    this.vaccinationCallback = this.vaccinationCallbackHOF(this.vaccinationSlider, this.vaccinationLabel, sim)
    this.vaccinationSlider.changed(this.vaccinationCallback)
  }

  /**
   * Group that includes a title, a label that can be updated with the value, an info subtitle and the slider
   */
  makeSliderGroup(title, info, titleParent, sliderParent, sliderMin, sliderMax, sliderStart, sliderStep) {
    const titleObj = createP(title)
    titleObj.parent(titleParent)
    if (info != null) {
      const infoObj = createP(info)
      infoObj.parent(titleParent)
      infoObj.addClass("colInfo")
    }
    const slider = createSlider(sliderMin, sliderMax, sliderStart, sliderStep)
    slider.parent(sliderParent)
    slider.addClass("slider")
    const label = createSpan(`${slider.value()}`)
    label.parent(titleObj)
    return [slider, label]
  }

  /**
   * Just a checkbox
   */
  makeCheckbox(title, parent, state = false) {
    const cb = createCheckbox(title, state)
    cb.parent(parent)
    cb.style('color', COLOR_LIGHT_GRAY)
    cb.style('display', "flex")
    cb.style('align-items', "center")
    return cb
  }

  /**
   * Basic button
   */
  makeButton(title, parent) {
    const btn = createButton(title)
    btn.parent(parent)
    return btn
  }

  /**
   * Button with styling for presets
   */
  makePresetBtn(title, parent) {
    const btn = this.makeButton(title, parent)
    btn.addClass("presetBtn")
    return btn
  }

  /**
   * Button with styling for Simulations
   */
  makeSimBtn(title, parent) {
    const btn = this.makeButton(title, parent)
    btn.addClass("simBtn")
    return btn
  }

  /**
   * Generate a callback for a simBtn to call when pressed
   * @param {Function} callback 
   * @param {Button} btn 
   * @param {Array} btns 
   */
  simBtnCallback(callback, btn, btns) {
    return () => {
      btns.forEach(b => {
        if (b.hasClass(SIM_BTN_STATE_ON_CLASS)) b.removeClass(SIM_BTN_STATE_ON_CLASS)
        if (!b.hasClass(SIM_BTN_STATE_OFF_CLASS)) b.addClass(SIM_BTN_STATE_OFF_CLASS)
      })
      callback()
      if (!btn.hasClass(SIM_BTN_STATE_ON_CLASS)) btn.addClass(SIM_BTN_STATE_ON_CLASS)
      if (btn.hasClass(SIM_BTN_STATE_OFF_CLASS)) btn.removeClass(SIM_BTN_STATE_OFF_CLASS)
    }
  }

  /**
   * Callbacks must be higher order functions because "this" is undefined when that callbacks are called
   * @param {Slider} slider 
   */
  popSizeCallbackHOF(slider, label) {
    return () => {
      label.html(slider.value())
    }
  }

  comSizeCallbackHOF(slider, label) {
    return () => {
      label.html(slider.value())
    }
  }


  sDistCallbackHOF(slider, label) {
    return () => {
      label.html(slider.value())
      Point.socialDistanceFactor = slider.value()
    }
  }

  igSDistCallbackHOF(slider, label, sim) {
    return () => {
      label.html(slider.value())
      sim.fields.forEach(f => f.pts.forEach(pt => {
        pt.ignoreSocialDistancing = random() < slider.value() / 100 ? true : false
      }))
      sim.sender.objs.forEach(o => {
        o.point.ignoreSocialDistancing = random() < slider.value() / 100 ? true : false
      })
    }
  }

  infRadCallbackHOF(slider, label) {
    return () => {
      label.html(slider.value())
      Point.infectionRadius = slider.value()
    }
  }

  infChanceCallbackHOF(slider, label) {
    return () => {
      label.html(slider.value())
      Point.infectionChance = slider.value()
    }
  }

  infPopInitCallbackHOF(slider, label) {
    return () => {
      label.html(slider.value())
    }
  }

  inf1DurationCallbackHOF(slider, label) {
    return () => {
      label.html(slider.value())
      Point.infectious1Interval = slider.value() * DAY_LENGTH
    }
  }

  inf2DurationCallbackHOF(slider, label) {
    return () => {
      label.html(slider.value())
      Point.infectious2Interval = slider.value() * DAY_LENGTH
    }
  }

  cenVisitIntCallbackHOF(slider, label) {
    return () => {
      if (slider.value() == CENTRAL_LOC_VISIT_INTERVAL_MAX) label.html("Off")
      else label.html(slider.value())
      CentralLocSender.visitInterval = slider.value()
    }
  }

  cenLeaveIntCallbackHOF(slider, label) {
    return () => {
      if (slider.value() == CENTRAL_LOC_LEAVE_INTERVAL_MAX) label.html("Off")
      else label.html(slider.value())
      CentralLocSender.leaveInterval = slider.value()
    }
  }

  comCrossIntCallbackHOF(slider, label) {
    return () => {
      if (slider.value() == COMMUNITIES_CROSSING_INTERVAL_MAX) label.html("Off")
      else label.html(slider.value())
      CommunitiesSender.interval = slider.value()
    }
  }

  testPropCallbackHOF(slider, label) {
    return () => {
      label.html(slider.value())
    }
  }

  simSpeedCallbackHOF(slider, label) {
    return () => {
      label.html(slider.value())
      Simulation.speed = slider.value()
    }
  }

  hospResCallbackHOF(slider, label) {
    return () => {
      label.html(slider.value())
      Simulation.hospitalResources = slider.value()
    }
  }

  deathChanceCallbackHOF(slider, label) {
    return () => {
      label.html(slider.value())
      Point.infectionUntreatedDeathRate = slider.value()
    }
  }

  qwsDelayCallbackHOF(slider, label) {
    return () => {
      label.html(slider.value())
    }
  }

  vaccinationCallbackHOF(slider, label, sim) {
    return () => {
      label.html(slider.value())
      sim.fields.forEach(f => f.pts.forEach(pt => {
        if (pt.status == Point.SUSCEPTIBLE) pt.status = random() < slider.value() / 100 ? Point.VACCINATED : Point.SUSCEPTIBLE
      }))
      sim.sender.objs.forEach(o => {
        if (o.point.status == Point.SUSCEPTIBLE) o.point.status = random() < slider.value() / 100 ? Point.VACCINATED : Point.SUSCEPTIBLE
      })
    }
  }
}