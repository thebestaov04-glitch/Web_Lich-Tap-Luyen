/* Nhịp Võ — ứng dụng lịch tập cá nhân, chạy hoàn toàn trong trình duyệt */
(() => {
  'use strict';

  const STORAGE_KEY = 'nhip-vo-personal-v1';
  const DAY_NAMES = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
  const DAY_SHORT = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const MEALS = ['Sáng', 'Trưa', 'Tối', 'Phụ'];
  const TYPES = { technique: 'Kỹ thuật', conditioning: 'Thể lực', stretch: 'Giãn cơ' };
  const TYPE_ICONS = { technique: '🥋', conditioning: '💪', stretch: '🧘' };
  const EXERCISE_LIBRARY = [
    { name: 'Ap chagi', type: 'technique', sets: 3, minutes: 5, reps: 10, rest: 45 },
    { name: 'Dollyo chagi', type: 'technique', sets: 3, minutes: 5, reps: 10, rest: 45 },
    { name: 'Yop chagi', type: 'technique', sets: 3, minutes: 5, reps: 8, rest: 45 },
    { name: 'Dwi chagi', type: 'technique', sets: 3, minutes: 5, reps: 8, rest: 60 },
    { name: 'Poomsae', type: 'technique', sets: 3, minutes: 4, reps: 1, rest: 60 },
    { name: 'Đối kháng Taekwondo', type: 'technique', sets: 3, minutes: 2, reps: 1, rest: 60 },
    { name: 'Bài dẻo dai', type: 'stretch', sets: 3, minutes: 5, reps: 1, rest: 30 },
    { name: 'Di chuyển tấn pháp', type: 'technique', sets: 3, minutes: 3, reps: 1, rest: 45 },
    { name: 'Phản xạ đòn chân', type: 'technique', sets: 3, minutes: 3, reps: 12, rest: 45 },
    { name: 'Đánh bao Taekwondo', type: 'technique', sets: 4, minutes: 3, reps: 1, rest: 60 },
    { name: 'Kỹ thuật liên hoàn', type: 'technique', sets: 4, minutes: 3, reps: 10, rest: 45 },
    { name: 'Nhảy dây', type: 'conditioning', sets: 3, minutes: 3, reps: 1, rest: 60 },
    { name: 'Thủ pháp & phản đòn', type: 'technique', sets: 3, minutes: 3, reps: 10, rest: 45 },
    { name: 'Sparring', type: 'technique', sets: 3, minutes: 3, reps: 1, rest: 60 },
    { name: 'Plank', type: 'conditioning', sets: 3, minutes: 1, reps: 1, rest: 45 },
    { name: 'Squat', type: 'conditioning', sets: 3, minutes: 3, reps: 15, rest: 45 },
    { name: 'Burpee', type: 'conditioning', sets: 3, minutes: 3, reps: 10, rest: 60 },
    { name: 'Chạy bộ', type: 'conditioning', sets: 1, minutes: 20, reps: 1, rest: 0 },
    { name: 'Core', type: 'conditioning', sets: 3, minutes: 5, reps: 1, rest: 45 }
  ];
  const FOOD_LIBRARY = [
    { id: 'rice', name: 'Cơm trắng', emoji: '🍚', kcal: 205, protein: 4, carbs: 45, fat: 0.4 },
    { id: 'pho', name: 'Phở bò', emoji: '🍜', kcal: 430, protein: 25, carbs: 55, fat: 11 },
    { id: 'bun', name: 'Bún thịt nướng', emoji: '🥢', kcal: 490, protein: 24, carbs: 63, fat: 15 },
    { id: 'egg', name: 'Trứng gà (2 quả)', emoji: '🥚', kcal: 144, protein: 13, carbs: 1, fat: 10 },
    { id: 'chicken', name: 'Ức gà (100 g)', emoji: '🍗', kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
    { id: 'banana', name: 'Chuối (1 quả)', emoji: '🍌', kcal: 105, protein: 1.3, carbs: 27, fat: 0.4 },
    { id: 'yogurt', name: 'Sữa chua không đường', emoji: '🥛', kcal: 100, protein: 5, carbs: 8, fat: 5 },
    { id: 'sweetpotato', name: 'Khoai lang (150 g)', emoji: '🍠', kcal: 135, protein: 2, carbs: 32, fat: 0.2 },
    { id: 'fish', name: 'Cá hồi (100 g)', emoji: '🐟', kcal: 208, protein: 20, carbs: 0, fat: 13 },
    { id: 'milk', name: 'Sữa tươi (250 ml)', emoji: '🥛', kcal: 150, protein: 8, carbs: 12, fat: 8 },
    { id: 'salad', name: 'Rau luộc / salad', emoji: '🥗', kcal: 80, protein: 3, carbs: 12, fat: 2 },
    { id: 'oats', name: 'Yến mạch (40 g)', emoji: '🥣', kcal: 152, protein: 5, carbs: 27, fat: 3 }
  ];

  // Lớp lưu trữ: mọi thao tác đều cập nhật localStorage ngay.
  const Storage = {
    defaults() {
      return {
        version: 2,
        learner: { studentId: '', fullName: '', birthDate: '', beltRank: '', photoData: '' },
        settings: { mode: 'light', theme: 'jade', font: 'normal', view: 'week', tab: 'home' },
        planner: { sessions: 4, goal: 'technique', level: 'intermediate', duration: 60, days: [0, 1, 3, 5] },
        schedule: [
          { id: 's-mon', day: 0, title: 'Nền tảng Taekwondo', minutes: 55, exercises: [this.exercise('Poomsae', 'technique', 3, 8, 1, 60), this.exercise('Ap chagi', 'technique', 3, 7, 10, 45), this.exercise('Bài dẻo dai', 'stretch', 2, 8, 1, 30)] },
          { id: 's-tue', day: 1, title: 'Kỹ thuật đòn chân & di chuyển', minutes: 50, exercises: [this.exercise('Dollyo chagi', 'technique', 3, 6, 10, 40), this.exercise('Yop chagi', 'technique', 3, 6, 8, 40), this.exercise('Di chuyển tấn pháp', 'technique', 3, 8, 1, 45)] },
          { id: 's-thu', day: 3, title: 'Thể lực & sức bền', minutes: 45, exercises: [this.exercise('Nhảy dây', 'conditioning', 3, 9, 1, 60), this.exercise('Squat', 'conditioning', 3, 7, 15, 45), this.exercise('Plank', 'conditioning', 3, 4, 1, 40)] },
          { id: 's-sat', day: 5, title: 'Poomsae & đối kháng', minutes: 60, exercises: [this.exercise('Poomsae', 'technique', 3, 9, 1, 60), this.exercise('Đối kháng Taekwondo', 'technique', 4, 12, 1, 60), this.exercise('Phản xạ đòn chân', 'technique', 3, 8, 12, 45)] }
        ],
        logs: {}, sparring: [],
        timer: { warmup: 30, round: 180, rest: 60, rounds: 2, sound: true, vibrate: true },
        nutrition: { profile: {}, meals: {}, water: {}, weights: [], foods: [], activeMeal: 'Sáng' }
      };
    },
    exercise(name, type, sets, minutes, reps, rest, note = '') {
      return { id: uid('ex'), name, type, sets, minutes, reps, rest, note, custom: false };
    },
    normalize(parsed) {
      const base = this.defaults();
      const isLegacy = Number(parsed.version || 1) < 2;
      const generatedPlanMigrations = [
        { oldTitle: 'Boxing · kỹ thuật tay', oldNames: ['Jab', 'Cross', 'Footwork'], title: 'Đòn chân & di chuyển', names: ['Dollyo chagi', 'Yop chagi', 'Di chuyển tấn pháp'] },
        { oldTitle: 'Boxing · di chuyển', oldNames: ['Shadow boxing', 'Hook', 'Combo 1–2–3'], title: 'Tốc độ và phản xạ', names: ['Phản xạ đòn chân', 'Thủ pháp & phản đòn', 'Kỹ thuật liên hoàn'] },
        { oldTitle: 'Boxing đốt năng lượng', oldNames: ['Shadow boxing', 'Nhảy dây', 'Burpee'], title: 'Taekwondo & thể lực', names: ['Dollyo chagi', 'Nhảy dây', 'Burpee'] },
        { oldTitle: 'Boxing nhịp độ', oldNames: ['Shadow boxing', 'Jab', 'Cross'], title: 'Nhịp độ đòn chân', names: ['Dollyo chagi', 'Yop chagi', 'Phản xạ đòn chân'] }
      ];
      const schedule = (Array.isArray(parsed.schedule) ? parsed.schedule : base.schedule).map(session => {
        if (isLegacy && session.id === 's-tue' && session.title === 'Boxing · kỹ thuật tay') {
          return { ...session, title: 'Kỹ thuật đòn chân & di chuyển', minutes: 50, exercises: [
            this.exercise('Dollyo chagi', 'technique', 3, 6, 10, 40), this.exercise('Yop chagi', 'technique', 3, 6, 8, 40), this.exercise('Di chuyển tấn pháp', 'technique', 3, 8, 1, 45)
          ] };
        }
        if (isLegacy && session.id === 's-sat' && session.title === 'Boxing · bao & phản xạ') {
          return { ...session, title: 'Poomsae & đối kháng', minutes: 60, exercises: [
            this.exercise('Poomsae', 'technique', 3, 9, 1, 60), this.exercise('Đối kháng Taekwondo', 'technique', 4, 12, 1, 60), this.exercise('Phản xạ đòn chân', 'technique', 3, 8, 12, 45)
          ] };
        }
        if (isLegacy && String(session.id || '').startsWith('session-')) {
          const exercises = Array.isArray(session.exercises) ? session.exercises : [];
          const names = exercises.map(exercise => exercise.name);
          const migration = generatedPlanMigrations.find(item => session.title === item.oldTitle && names.length === item.oldNames.length && names.every((name, index) => name === item.oldNames[index]) && exercises.every(exercise => !exercise.custom && !exercise.note));
          if (migration) {
            return { ...session, title: migration.title, exercises: migration.names.map((name, index) => {
              const template = EXERCISE_LIBRARY.find(item => item.name === name), old = exercises[index] || {};
              return { ...template, id: old.id || uid('ex'), sets: old.sets ?? template.sets, minutes: old.minutes ?? template.minutes, reps: old.reps ?? template.reps, rest: old.rest ?? template.rest, note: '', custom: false };
            }) };
          }
        }
        return session;
      });
      const timer = { ...base.timer, ...(parsed.timer || {}) };
      if (isLegacy && parsed.timer?.warmup === 30 && parsed.timer?.round === 180 && parsed.timer?.rest === 60 && parsed.timer?.rounds === 3) timer.rounds = 2;
      return {
        ...base, ...parsed, version: 2,
        learner: { ...base.learner, ...(parsed.learner && typeof parsed.learner === 'object' ? parsed.learner : {}) },
        settings: { ...base.settings, ...(parsed.settings || {}) },
        planner: { ...base.planner, ...(parsed.planner || {}) },
        schedule,
        logs: parsed.logs && typeof parsed.logs === 'object' ? parsed.logs : {},
        sparring: Array.isArray(parsed.sparring) ? parsed.sparring : [],
        timer,
        nutrition: { ...base.nutrition, ...(parsed.nutrition || {}) }
      };
    },
    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return this.defaults();
        const parsed = JSON.parse(raw);
        const normalized = this.normalize(parsed);
        if (Number(parsed.version || 1) < 2) {
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized)); }
          catch (error) { console.warn('Không thể lưu bản nâng cấp dữ liệu.', error); }
        }
        return normalized;
      } catch (error) {
        console.warn('Không đọc được dữ liệu cũ, dùng dữ liệu mẫu.', error);
        return this.defaults();
      }
    },
    save() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
      catch (error) { UI.toast('Không thể lưu. Bộ nhớ trình duyệt có thể đã đầy.', 'error'); }
    }
  };
  const uid = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  let state = Storage.load();

  // Hàm tiện ích ngày giờ, hiển thị và truy cập DOM.
  const Utils = {
    $(selector, root = document) { return root.querySelector(selector); },
    $$(selector, root = document) { return [...root.querySelectorAll(selector)]; },
    dateKey(date = new Date()) { const d = new Date(date); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; },
    parseDate(key) { const [y, m, d] = String(key).split('-').map(Number); return new Date(y, m - 1, d, 12); },
    mondayIndex(date) { return (date.getDay() + 6) % 7; },
    monday(date) { const d = new Date(date); d.setDate(d.getDate() - this.mondayIndex(d)); d.setHours(12, 0, 0, 0); return d; },
    addDays(date, count) { const d = new Date(date); d.setDate(d.getDate() + count); return d; },
    fmtDate(date, options = { day: 'numeric', month: 'short' }) { return new Intl.DateTimeFormat('vi-VN', options).format(date); },
    escape(text) { return String(text ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); },
    number(value, fallback = 0) { const n = Number(value); return Number.isFinite(n) ? n : fallback; },
    durationText(mins) { return mins >= 60 ? `${Math.floor(mins / 60)} giờ${mins % 60 ? ` ${mins % 60} phút` : ''}` : `${mins} phút`; },
    today() { return new Date(); }
  };
  const $ = Utils.$;
  const sessionForDay = day => state.schedule.find(session => Number(session.day) === Number(day));
  const logForDate = key => state.logs[key] || { exercises: {}, completed: false, minutes: 0 };
  const completedKeys = () => Object.entries(state.logs).filter(([, log]) => log && log.completed).map(([key]) => key).sort();
  const totalSessionMinutes = (key, log = logForDate(key)) => log.minutes || (sessionForDay(Utils.mondayIndex(Utils.parseDate(key)))?.minutes || 0);

  const UI = {
    validTabs: ['home', 'schedule', 'tracker', 'timer', 'nutrition', 'stats'],
    currentTab: 'home',
    toast(message, type = 'ok') {
      const el = document.createElement('div'); el.className = `toast ${type === 'error' ? 'error' : ''}`; el.textContent = message;
      $('#toast-region').append(el); setTimeout(() => el.remove(), 2800);
    },
    applySettings() {
      Tracker.view = state.settings.view || 'week';
      document.body.dataset.mode = state.settings.mode;
      document.body.dataset.theme = state.settings.theme;
      document.body.dataset.font = state.settings.font;
      $('#theme-select').value = state.settings.theme;
      const modeToggle = $('#mode-toggle');
      modeToggle.querySelector('#mode-icon').setAttribute('href', state.settings.mode === 'dark' ? '#icon-sun' : '#icon-moon');
      const nextMode = state.settings.mode === 'dark' ? 'sáng' : 'tối';
      modeToggle.setAttribute('aria-label', `Chuyển sang giao diện ${nextMode}`);
      modeToggle.title = `Chuyển sang giao diện ${nextMode}`;
      modeToggle.setAttribute('aria-pressed', String(state.settings.mode === 'dark'));
      const fontToggle = $('#font-toggle');
      const fontStateLabel = { normal: 'bình thường', large: 'lớn', small: 'nhỏ' }[state.settings.font] || 'bình thường';
      fontToggle.dataset.fontState = state.settings.font || 'normal';
      fontToggle.setAttribute('aria-label', `Đổi cỡ chữ, hiện tại ${fontStateLabel}`);
      fontToggle.title = `Cỡ chữ hiện tại: ${fontStateLabel}`;
      const requestedTab = window.location.hash.replace(/^#/, '');
      const startTab = this.validTabs.includes(requestedTab) ? requestedTab : state.settings.tab || 'home';
      UI.setTab(startTab, false, true);
    },
    setTab(tab, save = true, updateHash = true) {
      if (!this.validTabs.includes(tab)) tab = 'home';
      this.currentTab = tab;
      Utils.$$('.tab-panel').forEach(el => el.classList.toggle('active', el.id === `tab-${tab}`));
      Utils.$$('[data-tab]').forEach(el => el.classList.toggle('active', el.dataset.tab === tab));
      const labels = { home: 'Tổng quan', schedule: 'Lịch tập', tracker: 'Theo dõi', timer: 'Đồng hồ hiệp', nutrition: 'Dinh dưỡng', stats: 'Thống kê' };
      $('#page-label').textContent = labels[tab];
      if (save) { state.settings.tab = tab; Storage.save(); }
      if (updateHash && window.location.hash !== `#${tab}`) window.location.hash = tab;
      if (tab === 'tracker') Tracker.render();
      if (tab === 'nutrition') Nutrition.render();
      if (tab === 'stats') Stats.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    renderDateHeader() {
      const now = Utils.today();
      $('#today-weekday').textContent = DAY_NAMES[Utils.mondayIndex(now)].toLocaleUpperCase('vi-VN');
      $('#today-date').textContent = Utils.fmtDate(now, { day: 'numeric', month: 'long', year: 'numeric' });
    }
  };

  // Lịch tập: tạo kế hoạch, thêm bài tự tạo và chỉnh thứ tự các buổi.
  const Schedule = {
    selectedDays: [0, 1, 3, 5],
    init() {
      this.loadPlannerControls();
      const picks = $('#day-picker');
      DAY_SHORT.forEach((label, day) => {
        const button = document.createElement('button'); button.type = 'button'; button.className = 'day-choice'; button.dataset.day = day; button.textContent = label;
        button.addEventListener('click', () => {
          const index = this.selectedDays.indexOf(day);
          if (index >= 0) this.selectedDays.splice(index, 1);
          else if (this.selectedDays.length < 7) this.selectedDays.push(day);
          this.selectedDays.sort((a, b) => a - b); this.renderDayPicker(); this.savePlanner();
        });
        picks.append(button);
      });
      $('#sessions-per-week').addEventListener('change', () => { this.syncSelectedCount(); this.savePlanner(); });
      ['training-goal', 'skill-level', 'session-duration'].forEach(id => $(`#${id}`).addEventListener('change', () => this.savePlanner()));
      $('#auto-plan-btn').addEventListener('click', () => this.autoPlan());
      $('#auto-plan-btn-mobile').addEventListener('click', () => this.autoPlan());
      $('#reset-schedule').addEventListener('click', () => { const defaults = Storage.defaults(); state.schedule = defaults.schedule; state.planner = defaults.planner; this.selectedDays = [...defaults.planner.days]; $('#sessions-per-week').value = String(defaults.planner.sessions); $('#training-goal').value = defaults.planner.goal; $('#skill-level').value = defaults.planner.level; $('#session-duration').value = String(defaults.planner.duration); this.renderDayPicker(); Storage.save(); this.render(); Tracker.render(); Home.render(); UI.toast('Đã khôi phục lịch mẫu.'); });
      $('#add-session-btn').addEventListener('click', () => this.addSession());
      $('#exercise-form').addEventListener('submit', event => this.addFromForm(event));
      $('#schedule-list').addEventListener('click', event => this.handleAction(event));
      $('#library-toggle').addEventListener('click', event => {
        const list = $('#exercise-library'); const hidden = list.classList.toggle('hidden'); event.currentTarget.textContent = hidden ? 'Mở rộng' : 'Thu gọn';
      });
      this.renderLibrary(); this.renderDayPicker(); this.render();
    },
    loadPlannerControls() {
      const planner = state.planner || {};
      this.selectedDays = Array.isArray(planner.days) && planner.days.length ? planner.days.filter(day => Number.isInteger(Number(day)) && Number(day) >= 0 && Number(day) <= 6).map(Number) : [...new Set(state.schedule.map(session => Number(session.day)))];
      $('#sessions-per-week').value = planner.sessions || this.selectedDays.length || 4;
      $('#training-goal').value = planner.goal || 'technique'; $('#skill-level').value = planner.level || 'intermediate'; $('#session-duration').value = planner.duration || 60;
      this.renderDayPicker();
    },
    renderDayPicker() { Utils.$$('.day-choice').forEach(button => button.classList.toggle('selected', this.selectedDays.includes(Number(button.dataset.day)))); },
    savePlanner() {
      state.planner = { sessions: Utils.number($('#sessions-per-week').value, this.selectedDays.length), goal: $('#training-goal').value || 'technique', level: $('#skill-level').value || 'intermediate', duration: Utils.number($('#session-duration').value, 60), days: [...this.selectedDays] };
      Storage.save();
    },
    syncPlannerFromSchedule() {
      const days = [...new Set(state.schedule.map(session => Number(session.day)))].sort((a, b) => a - b);
      this.selectedDays = days;
      if (days.length >= 1 && days.length <= 7) $('#sessions-per-week').value = String(days.length);
      this.savePlanner(); this.renderDayPicker();
    },
    syncSelectedCount() {
      const count = Utils.number($('#sessions-per-week').value, 4);
      if (this.selectedDays.length < count) {
        for (let day = 0; day < 7 && this.selectedDays.length < count; day++) if (!this.selectedDays.includes(day)) this.selectedDays.push(day);
      } else if (this.selectedDays.length > count) this.selectedDays = this.selectedDays.slice(0, count);
      this.selectedDays.sort((a, b) => a - b); this.renderDayPicker();
    },
    renderLibrary() {
      $('#exercise-suggestions').innerHTML = EXERCISE_LIBRARY.map(item => `<option value="${Utils.escape(item.name)}"></option>`).join('');
      $('#exercise-library').innerHTML = EXERCISE_LIBRARY.map((item, index) => `<button type="button" class="library-chip" data-library="${index}" title="${TYPES[item.type]}">${Utils.escape(item.name)}</button>`).join('');
      $('#exercise-library').addEventListener('click', event => {
        const button = event.target.closest('[data-library]'); if (!button) return;
        const item = EXERCISE_LIBRARY[Number(button.dataset.library)];
        if (!state.schedule.length) { UI.toast('Hãy tạo lịch trước khi thêm bài tập.', 'error'); return; }
        const daySelect = $('#exercise-day'); if (!daySelect.value) daySelect.value = state.schedule[0].id;
        this.addExercise(daySelect.value, { ...item, note: '' });
      });
    },
    autoPlan() {
      const count = Utils.number($('#sessions-per-week').value, 4);
      this.syncSelectedCount();
      if (this.selectedDays.length !== count) { UI.toast('Chọn đúng số ngày tập đã cài đặt.', 'error'); return; }
      const goal = $('#training-goal').value, level = $('#skill-level').value, duration = Utils.number($('#session-duration').value, 60);
      const target = {
        competition: ['Kỹ thuật thi đấu', 'Đối kháng & phản xạ', 'Thể lực võ sĩ', 'Mô phỏng thi đấu', 'Kỹ thuật tốc độ', 'Sức mạnh toàn thân'],
        weight: ['Taekwondo & thể lực', 'Kỹ thuật toàn thân', 'Cardio & cơ lõi', 'Kỹ thuật liên hoàn', 'Sức bền võ sĩ', 'Phục hồi chủ động'],
        endurance: ['Sức bền nền tảng', 'Nhịp độ đòn chân', 'Thể lực toàn thân', 'Taekwondo liên tục', 'Cardio & cơ lõi', 'Hồi phục linh hoạt'],
        technique: ['Nền tảng Taekwondo', 'Đòn chân & di chuyển', 'Chân & thăng bằng', 'Tốc độ và phản xạ', 'Poomsae & đối kháng', 'Ôn kỹ thuật toàn thân']
      }[goal];
      const pools = {
        competition: [['Poomsae', 'Dollyo chagi', 'Sparring'], ['Dwi chagi', 'Yop chagi', 'Phản xạ đòn chân'], ['Burpee', 'Squat', 'Plank'], ['Đối kháng Taekwondo', 'Đánh bao Taekwondo', 'Di chuyển tấn pháp']],
        weight: [['Nhảy dây', 'Chạy bộ', 'Burpee'], ['Ap chagi', 'Dollyo chagi', 'Squat'], ['Chạy bộ', 'Core', 'Plank'], ['Kỹ thuật liên hoàn', 'Đánh bao Taekwondo', 'Nhảy dây']],
        endurance: [['Chạy bộ', 'Nhảy dây', 'Core'], ['Poomsae', 'Phản xạ đòn chân', 'Di chuyển tấn pháp'], ['Burpee', 'Squat', 'Plank'], ['Poomsae', 'Đối kháng Taekwondo', 'Bài dẻo dai']],
        technique: [['Poomsae', 'Ap chagi', 'Yop chagi'], ['Dollyo chagi', 'Dwi chagi', 'Di chuyển tấn pháp'], ['Dollyo chagi', 'Dwi chagi', 'Bài dẻo dai'], ['Phản xạ đòn chân', 'Thủ pháp & phản đòn', 'Kỹ thuật liên hoàn']]
      };
      const pool = pools[goal]; const names = pool;
      const repsMultiplier = level === 'beginner' ? 0.75 : level === 'advanced' ? 1.35 : 1;
      state.schedule = this.selectedDays.map((day, index) => {
        const chosenNames = names[index % names.length];
        const exercises = chosenNames.map(name => {
          const base = EXERCISE_LIBRARY.find(item => item.name === name);
          return { ...base, id: uid('ex'), reps: Math.max(1, Math.round(base.reps * repsMultiplier)), note: '', custom: false };
        });
        if (duration >= 60) exercises.push({ ...EXERCISE_LIBRARY.find(item => item.name === (index % 2 ? 'Core' : 'Bài dẻo dai')), id: uid('ex'), minutes: 8, custom: false, note: '' });
        return { id: uid('session'), day, title: target[index % target.length], minutes: duration, exercises };
      });
      this.savePlanner();
      Storage.save(); this.render(); Tracker.render(); Home.render(); UI.toast('Đã tạo lịch mới theo mục tiêu và trình độ.');
    },
    addFromForm(event) {
      event.preventDefault();
      const sessionId = $('#exercise-day').value;
      const name = $('#exercise-name').value.trim();
      if (!sessionId || !name) { UI.toast('Chọn ngày tập và nhập tên bài.', 'error'); return; }
      this.addExercise(sessionId, {
        name, type: $('#exercise-type').value, sets: Math.max(1, Utils.number($('#exercise-sets').value, 3)),
        minutes: Math.max(0, Utils.number($('#exercise-minutes').value)), reps: Math.max(0, Utils.number($('#exercise-reps').value)),
        rest: Math.max(0, Utils.number($('#exercise-rest').value)), note: $('#exercise-note').value.trim(), custom: true
      });
      $('#exercise-name').value = ''; $('#exercise-note').value = '';
    },
    addExercise(sessionId, item) {
      const session = state.schedule.find(entry => entry.id === sessionId);
      if (!session) return;
      session.exercises.push({ ...item, id: uid('ex'), custom: item.custom ?? !EXERCISE_LIBRARY.some(lib => lib.name === item.name) });
      Storage.save(); this.render(); Tracker.render(); Home.render(); UI.toast(`Đã thêm “${item.name}”.`);
    },
    addSession() {
      const used = new Set(state.schedule.map(item => Number(item.day)));
      const day = [...Array(7).keys()].find(value => !used.has(value));
      if (day === undefined) { UI.toast('Mỗi thứ đã có một buổi tập.', 'error'); return; }
      state.schedule.push({ id: uid('session'), day, title: 'Buổi tập cá nhân', minutes: 45, exercises: [] }); this.syncPlannerFromSchedule();
      Storage.save(); this.render(); Tracker.render(); Home.render(); UI.toast(`Đã thêm buổi tập vào ${DAY_NAMES[day]}.`);
    },
    handleAction(event) {
      const button = event.target.closest('[data-action]'); if (!button) return;
      const session = state.schedule.find(item => item.id === button.dataset.session); if (!session) return;
      const index = state.schedule.indexOf(session), action = button.dataset.action;
      if (action === 'remove-exercise') {
        session.exercises = session.exercises.filter(exercise => exercise.id !== button.dataset.exercise);
        Storage.save(); this.render(); Tracker.render(); Home.render(); UI.toast('Đã xóa bài tập khỏi buổi.'); return;
      }
      if (action === 'edit-session') {
        const title = window.prompt('Tên buổi tập:', session.title);
        if (title === null) return;
        const dayInput = window.prompt(`Ngày tập (1 = Thứ Hai, 7 = Chủ Nhật):\n${DAY_NAMES.map((name, i) => `${i + 1}. ${name}`).join('\n')}`, String(session.day + 1));
        if (dayInput === null) return;
        const day = Math.max(1, Math.min(7, Math.round(Utils.number(dayInput, session.day + 1)))) - 1;
        if (state.schedule.some(item => item.id !== session.id && Number(item.day) === day)) { UI.toast('Ngày này đã có buổi tập khác.', 'error'); return; }
        session.title = title.trim() || 'Buổi tập cá nhân'; session.day = day;
        this.syncPlannerFromSchedule(); Storage.save(); this.render(); Tracker.render(); Home.render(); UI.toast('Đã cập nhật buổi tập.'); return;
      }
      if (action === 'delete') { state.schedule.splice(index, 1); UI.toast('Đã xóa buổi tập.'); }
      if (action === 'up' && index > 0) [state.schedule[index - 1], state.schedule[index]] = [state.schedule[index], state.schedule[index - 1]];
      if (action === 'down' && index < state.schedule.length - 1) [state.schedule[index + 1], state.schedule[index]] = [state.schedule[index], state.schedule[index + 1]];
      if (action === 'copy') {
        const used = new Set(state.schedule.map(item => Number(item.day)));
        const nextDay = [...Array(7).keys()].find(day => !used.has(day));
        if (nextDay === undefined) { UI.toast('Mỗi thứ đã có một buổi tập.', 'error'); return; }
        const copy = JSON.parse(JSON.stringify(session)); copy.id = uid('session'); copy.day = nextDay; copy.title = `${session.title} · bản sao`;
        copy.exercises = copy.exercises.map(exercise => ({ ...exercise, id: uid('ex') })); state.schedule.push(copy);
        this.syncPlannerFromSchedule(); UI.toast(`Đã sao chép buổi tập sang ${DAY_NAMES[nextDay]}.`);
      }
      this.syncPlannerFromSchedule(); Storage.save(); this.render(); Tracker.render(); Home.render();
    },
    render() {
      $('#schedule-count').textContent = `${state.schedule.length} buổi`;
      const sorted = [...state.schedule];
      $('#schedule-empty').classList.toggle('hidden', sorted.length !== 0);
      $('#schedule-list').innerHTML = sorted.map(session => {
        const exerciseHtml = session.exercises.map(exercise => `<div class="exercise-row"><span class="exercise-type-dot">${TYPE_ICONS[exercise.type] || '🥋'}</span><div class="exercise-info"><strong>${Utils.escape(exercise.name)}</strong><small>${TYPES[exercise.type] || 'Kỹ thuật'} · ${exercise.sets} hiệp × ${exercise.minutes} phút · ${exercise.reps} lần · nghỉ ${exercise.rest}s</small></div><button class="mini-action" data-action="remove-exercise" data-session="${session.id}" data-exercise="${exercise.id}" title="Xóa bài tập" aria-label="Xóa ${Utils.escape(exercise.name)}">×</button></div>${exercise.note ? `<div class="exercise-note">Ghi chú: ${Utils.escape(exercise.note)}</div>` : ''}`).join('') || '<div class="exercise-note">Chưa có bài tập. Thêm từ thư viện nhanh.</div>';
        return `<article class="schedule-session"><div class="session-head"><span class="session-day">${DAY_SHORT[session.day]}</span><span class="session-title">${Utils.escape(session.title)}</span><span class="session-meta">${session.exercises.length} bài · ${session.minutes} phút</span><div class="session-actions"><button class="mini-action" data-action="edit-session" data-session="${session.id}" title="Đổi tên hoặc ngày tập">✎</button><button class="mini-action" data-action="up" data-session="${session.id}" title="Đưa lên">↑</button><button class="mini-action" data-action="down" data-session="${session.id}" title="Đưa xuống">↓</button><button class="mini-action" data-action="copy" data-session="${session.id}" title="Sao chép buổi">⧉</button><button class="mini-action" data-action="delete" data-session="${session.id}" title="Xóa buổi">×</button></div></div>${exerciseHtml}</article>`;
      }).join('');
      const select = $('#exercise-day'); const previous = select.value;
      select.innerHTML = state.schedule.map(s => `<option value="${s.id}">${DAY_NAMES[s.day]} · ${Utils.escape(s.title)}</option>`).join('');
      if (state.schedule.some(s => s.id === previous)) select.value = previous;
      else if (state.schedule[0]) select.value = state.schedule[0].id;
      $('#exercise-form button[type="submit"]').disabled = !state.schedule.length;
    }
  };

  // Theo dõi theo ngày, tuần, tháng, năm; nhật ký buổi tập và sparring.
  const Tracker = {
    selectedDate: Utils.today(),
    view: state.settings.view || 'week',
    init() {
      $('#view-switch').addEventListener('click', event => {
        const button = event.target.closest('[data-view]'); if (!button) return;
        this.view = button.dataset.view; state.settings.view = this.view; Storage.save(); this.render();
      });
      $('#date-prev').addEventListener('click', () => this.shift(-1)); $('#date-next').addEventListener('click', () => this.shift(1));
      $('#date-today').addEventListener('click', () => { this.selectedDate = Utils.today(); this.render(); });
      $('#tracker-date').addEventListener('change', event => { if (event.target.value) { this.selectedDate = Utils.parseDate(event.target.value); this.render(); } });
      $('#tracker-calendar').addEventListener('click', event => {
        const cell = event.target.closest('[data-date]'); if (!cell) return;
        this.selectedDate = Utils.parseDate(cell.dataset.date); this.render();
      });
      $('#daily-exercises').addEventListener('change', event => {
        const box = event.target.closest('[data-exercise-check]'); if (!box) return;
        const key = Utils.dateKey(this.selectedDate); const log = logForDate(key); log.exercises[box.dataset.exerciseCheck] = box.checked;
        const session = sessionForDay(Utils.mondayIndex(this.selectedDate));
        if (session && session.exercises.length && session.exercises.every(ex => log.exercises[ex.id])) { log.completed = true; log.minutes = session.minutes; }
        state.logs[key] = log; Storage.save(); this.render(); Home.render(); Stats.render();
      });
      $('#complete-session').addEventListener('click', () => this.markComplete(true));
      $('#undo-session').addEventListener('click', () => this.markComplete(false));
      $('#sparring-date').value = Utils.dateKey();
      $('#sparring-form').addEventListener('submit', event => this.addSparring(event));
      $('#sparring-list').addEventListener('click', event => {
        const button = event.target.closest('[data-remove-sparring]'); if (!button) return;
        state.sparring = state.sparring.filter(item => item.id !== button.dataset.removeSparring); Storage.save(); this.renderSparring(); Stats.render();
      });
      this.render(); this.renderSparring();
    },
    shift(direction) {
      if (this.view === 'day') this.selectedDate = Utils.addDays(this.selectedDate, direction);
      if (this.view === 'week') this.selectedDate = Utils.addDays(this.selectedDate, direction * 7);
      if (this.view === 'month') { this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + direction, Math.min(this.selectedDate.getDate(), 28), 12); }
      if (this.view === 'year') this.selectedDate = new Date(this.selectedDate.getFullYear() + direction, this.selectedDate.getMonth(), this.selectedDate.getDate(), 12);
      this.render();
    },
    render() {
      Utils.$$('#view-switch button').forEach(button => button.classList.toggle('selected', button.dataset.view === this.view));
      $('#tracker-date').value = Utils.dateKey(this.selectedDate);
      this.renderCalendar(); this.renderDayLog();
    },
    periodText() {
      const d = this.selectedDate;
      if (this.view === 'day') return Utils.fmtDate(d, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      if (this.view === 'week') { const start = Utils.monday(d), end = Utils.addDays(start, 6); return `${Utils.fmtDate(start, { day: 'numeric', month: 'short' })} – ${Utils.fmtDate(end, { day: 'numeric', month: 'short', year: 'numeric' })}`; }
      if (this.view === 'month') return Utils.fmtDate(d, { month: 'long', year: 'numeric' });
      return String(d.getFullYear());
    },
    renderCalendar() {
      const container = $('#tracker-calendar'), selectedKey = Utils.dateKey(this.selectedDate), todayKey = Utils.dateKey();
      $('#tracker-period').textContent = this.periodText();
      if (this.view === 'day') {
        const session = sessionForDay(Utils.mondayIndex(this.selectedDate)), log = logForDate(selectedKey);
        container.innerHTML = `<div class="day-view-grid"><div class="day-view-cell">Ngày</div><div class="day-view-cell">${this.periodText()}</div><div class="day-view-cell">Kế hoạch</div><div class="day-view-cell">${session ? `${Utils.escape(session.title)} · ${session.minutes} phút` : 'Ngày nghỉ / chưa có lịch'}</div><div class="day-view-cell">Ghi nhận</div><div class="day-view-cell">${log.completed ? '✓ Buổi tập hoàn thành' : 'Chưa đánh dấu hoàn thành'}</div></div>`;
      } else if (this.view === 'week') {
        const start = Utils.monday(this.selectedDate);
        container.innerHTML = `<div class="calendar-grid">${DAY_SHORT.map((label, day) => {
          const date = Utils.addDays(start, day), key = Utils.dateKey(date), log = logForDate(key), session = sessionForDay(day);
          return `<button class="week-calendar-day ${key === todayKey ? 'is-today' : ''} ${key === selectedKey ? 'selected' : ''}" data-date="${key}"><strong>${label} · ${date.getDate()}</strong><em>${session ? Utils.escape(session.title) : 'Ngày nghỉ'}</em>${session ? '<i class="week-dot"></i>' : ''}${log.completed ? '<span class="week-done">✓ Hoàn thành</span>' : ''}</button>`;
        }).join('')}</div>`;
      } else if (this.view === 'month') {
        const year = this.selectedDate.getFullYear(), month = this.selectedDate.getMonth();
        const first = Utils.monday(new Date(year, month, 1, 12)), end = new Date(year, month + 1, 0, 12);
        const total = Math.ceil((Utils.mondayIndex(end) + end.getDate() + Utils.mondayIndex(new Date(year, month, 1, 12))) / 7) * 7;
        const cells = [];
        for (let i = 0; i < total; i++) {
          const date = Utils.addDays(first, i), key = Utils.dateKey(date), log = logForDate(key), session = sessionForDay(Utils.mondayIndex(date));
          cells.push(`<button class="calendar-cell ${date.getMonth() !== month ? 'outside' : ''} ${key === todayKey ? 'today' : ''} ${key === selectedKey ? 'selected' : ''} ${log.completed ? 'completed' : ''}" data-date="${key}">${date.getDate()}${session ? '<i class="cell-dot"></i>' : ''}</button>`);
        }
        container.innerHTML = `<div class="calendar-grid">${DAY_SHORT.map(day => `<div class="calendar-heading">${day}</div>`).join('')}${cells.join('')}</div>`;
      } else {
        const year = this.selectedDate.getFullYear(), start = new Date(year, 0, 1, 12), totalDays = (new Date(year + 1, 0, 1) - start) / 86400000;
        const offset = Utils.mondayIndex(start), count = Math.ceil((offset + totalDays) / 7) * 7;
        const cells = [];
        for (let i = 0; i < count; i++) {
          const date = Utils.addDays(start, i - offset), key = Utils.dateKey(date), log = logForDate(key);
          const outside = date.getFullYear() !== year; const level = !log.completed ? 0 : Math.min(4, 1 + Math.floor(totalSessionMinutes(key) / 35));
          cells.push(`<button class="heat-cell level-${level} ${outside ? 'outside' : ''}" data-date="${key}" title="${Utils.fmtDate(date, { day: 'numeric', month: 'short', year: 'numeric' })}${log.completed ? ` · ${totalSessionMinutes(key)} phút` : ''}" aria-label="${key}${log.completed ? ', đã tập' : ''}"></button>`);
        }
        container.innerHTML = `<div class="heatmap-wrap"><div class="heatmap">${cells.join('')}</div><div class="week-footer"><span>Ít</span><i class="heat-cell"></i><i class="heat-cell level-1"></i><i class="heat-cell level-2"></i><i class="heat-cell level-3"></i><i class="heat-cell level-4"></i><span>Nhiều</span></div></div>`;
      }
    },
    renderDayLog() {
      const date = this.selectedDate, key = Utils.dateKey(date), day = Utils.mondayIndex(date), session = sessionForDay(day), log = logForDate(key);
      $('#log-date-title').textContent = Utils.fmtDate(date, { weekday: 'long', day: 'numeric', month: 'long' });
      const status = $('#log-day-status'); status.textContent = log.completed ? 'ĐÃ HOÀN THÀNH' : 'CHƯA HOÀN THÀNH'; status.classList.toggle('complete', log.completed);
      $('#daily-exercises').innerHTML = session && session.exercises.length ? session.exercises.map(ex => `<label class="tracker-exercise ${log.exercises[ex.id] ? 'checked' : ''}"><input type="checkbox" data-exercise-check="${ex.id}" ${log.exercises[ex.id] ? 'checked' : ''}><span>${Utils.escape(ex.name)}</span><small>${ex.sets} hiệp · ${ex.minutes} phút</small></label>`).join('') : `<div class="log-empty">${session ? 'Buổi tập này chưa có bài tập.' : 'Ngày này chưa có lịch. Bạn vẫn có thể ghi nhận buổi tập hoàn thành.'}</div>`;
      $('#complete-session').textContent = log.completed ? '✓ Đã hoàn thành' : '✓ Đánh dấu hoàn thành';
      $('#complete-session').classList.toggle('button-primary', !log.completed); $('#complete-session').classList.toggle('button-outline', log.completed);
    },
    markComplete(completed) {
      const key = Utils.dateKey(this.selectedDate), log = logForDate(key), session = sessionForDay(Utils.mondayIndex(this.selectedDate));
      log.completed = completed; log.minutes = completed ? (session?.minutes || log.minutes || 45) : 0;
      if (completed && session) session.exercises.forEach(ex => { log.exercises[ex.id] = true; });
      if (!completed) log.exercises = {};
      state.logs[key] = log; Storage.save(); this.render(); Home.render(); Stats.render(); UI.toast(completed ? 'Đã ghi nhận buổi tập hoàn thành.' : 'Đã bỏ đánh dấu buổi tập.');
    },
    addSparring(event) {
      event.preventDefault();
      state.sparring.unshift({ id: uid('spar'), date: $('#sparring-date').value || Utils.dateKey(), result: $('#sparring-result').value, note: $('#sparring-note').value.trim() });
      $('#sparring-note').value = ''; Storage.save(); this.renderSparring(); Stats.render(); UI.toast('Đã lưu nhật ký sparring.');
    },
    renderSparring() {
      const items = state.sparring.slice().sort((a, b) => b.date.localeCompare(a.date));
      $('#sparring-list').innerHTML = items.length ? items.slice(0, 4).map(item => `<div class="sparring-item"><span>🥊</span><div><strong>${Utils.fmtDate(Utils.parseDate(item.date), { day: 'numeric', month: 'short', year: 'numeric' })}</strong><small>${Utils.escape(item.note || 'Không có ghi chú')}</small></div><span class="sparring-result">${Utils.escape(item.result)}</span><button class="meal-delete" data-remove-sparring="${item.id}" aria-label="Xóa nhật ký">×</button></div>`).join('') : '<div class="recent-empty">Chưa có nhật ký sparring.</div>';
    }
  };

  // Tổng quan cá nhân lấy trực tiếp từ lịch và nhật ký.
  const Home = {
    selectedDay: null,
    detailsOpen: false,
    init() {
      $('#week-strip').addEventListener('click', event => {
        const button = event.target.closest('[data-week-day]');
        if (!button) return;
        const nextDay = Number(button.dataset.weekDay);
        this.detailsOpen = nextDay === (this.selectedDay ?? Utils.mondayIndex(Utils.today())) ? !this.detailsOpen : true;
        this.selectedDay = nextDay;
        this.renderSelectedDay();
      });
    },
    render() {
      UI.renderDateHeader();
      const learner = state.learner || {};
      const learnerName = String(learner.fullName || '').trim();
      const hasLearner = Boolean(learnerName);
      const birthDateValue = String(learner.birthDate || '');
      const parsedBirthDate = /^\d{4}-\d{2}-\d{2}$/.test(birthDateValue) ? Utils.parseDate(birthDateValue) : null;
      const birthDateLabel = parsedBirthDate && Number.isFinite(parsedBirthDate.getTime()) ? Utils.fmtDate(parsedBirthDate, { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
      $('#home-greeting').innerHTML = `${hasLearner ? `Chào ${Utils.escape(learnerName)}` : 'Chào võ sĩ'} <span class="wave">✦</span>`;
      const learnerDetails = $('#learner-details');
      learnerDetails.innerHTML = hasLearner ? [
        ['Mã học viên', learner.studentId || '—'],
        ['Ngày sinh', birthDateLabel],
        ['Cấp đai', learner.beltRank || '—']
      ].map(([label, value]) => `<span class="learner-detail"><small>${label}</small><strong>${Utils.escape(value)}</strong></span>`).join('') : '';
      learnerDetails.classList.toggle('hidden', !hasLearner);
      $('#learner-edit-btn').textContent = hasLearner ? '✎ Sửa hồ sơ' : '＋ Hồ sơ học viên';
      $('#sidebar-learner-name').textContent = hasLearner ? learnerName : 'Võ sĩ cá nhân';
      $('#sidebar-learner-meta').textContent = hasLearner ? `Mã HV · ${learner.studentId}` : 'Tập luyện độc lập';
      const todayKey = Utils.dateKey(), today = Utils.today(), day = Utils.mondayIndex(today), session = sessionForDay(day), log = logForDate(todayKey);
      const completed = completedKeys(); const minutes = completed.reduce((sum, key) => sum + totalSessionMinutes(key), 0);
      const streak = Stats.currentStreak();
      $('#home-stats').innerHTML = [
        ['◷', 'Buổi tập tháng này', `${completed.filter(key => key.slice(0, 7) === todayKey.slice(0, 7)).length}`, 'buổi', ''],
        ['⏱', 'Thời gian đã tập', `${minutes >= 60 ? (minutes / 60).toFixed(1) : minutes}`, minutes >= 60 ? 'giờ' : 'phút', 'orange'],
        ['🔥', 'Streak hiện tại', `${streak}`, 'ngày', 'rose'],
        ['🥋', 'Lịch tuần này', `${state.schedule.length}`, 'buổi', 'blue']
      ].map(([icon, label, value, unit, color]) => `<div class="stat-card"><span class="stat-icon ${color}">${icon}</span><div><small>${label}</small><strong>${value}</strong><em>${unit}</em></div></div>`).join('');
      const monday = Utils.monday(today);
      const selectedDay = this.selectedDay ?? day;
      $('#week-strip').innerHTML = DAY_SHORT.map((label, index) => {
        const date = Utils.addDays(monday, index), key = Utils.dateKey(date), done = logForDate(key).completed, planned = Boolean(sessionForDay(index));
        return `<button type="button" class="week-day ${key === todayKey ? 'today' : ''} ${done ? 'completed' : ''} ${planned ? 'planned' : ''} ${selectedDay === index ? 'selected' : ''}" data-week-day="${index}" aria-pressed="${selectedDay === index}" aria-expanded="${selectedDay === index && this.detailsOpen}" aria-label="${Utils.fmtDate(date, { weekday: 'long', day: 'numeric', month: 'long' })}"><span>${label}</span><span class="day-ball">${date.getDate()}</span></button>`;
      }).join('');
      const weekDone = [...Array(7).keys()].filter(index => logForDate(Utils.dateKey(Utils.addDays(monday, index))).completed).length;
      $('#week-completion').textContent = `${weekDone} buổi hoàn thành`;
      this.renderSelectedDay();
      $('#today-status').textContent = log.completed ? 'ĐÃ HOÀN THÀNH' : session ? 'CÓ LỊCH HÔM NAY' : 'NGÀY PHỤC HỒI';
      $('#today-status').classList.toggle('complete', log.completed);
      if (!session) $('#today-workout').innerHTML = '<div class="empty-line"><span>🌿</span><span>Ngày nghỉ cũng là một phần của tiến bộ. Hãy ưu tiên hồi phục.</span></div>';
      else if (session.exercises.length === 0) $('#today-workout').innerHTML = '<div class="empty-line"><span>🥋</span><span>Buổi tập đã có lịch. Thêm bài tập để bắt đầu.</span></div>';
      else $('#today-workout').innerHTML = session.exercises.slice(0, 3).map(ex => `<div class="today-exercise-line"><i class="mini-dot"></i><span>${Utils.escape(ex.name)}</span><small>${ex.sets} hiệp · ${ex.minutes} phút</small></div>`).join('');
      const todayName = session ? session.title : 'Ngày hồi phục';
      $('#hero-title').textContent = log.completed ? 'Một buổi tập đáng tự hào.' : session ? todayName : 'Mỗi hiệp đấu, một bước tiến.';
      $('#hero-subtitle').textContent = log.completed ? 'Bạn đã hoàn thành mục tiêu hôm nay. Hãy dành thời gian hồi phục.' : session ? `${session.exercises.length} bài tập · khoảng ${session.minutes} phút. Bắt đầu theo nhịp của bạn.` : 'Kỷ luật hôm nay tạo nên sức mạnh ngày mai.';
    },
    renderSelectedDay() {
      const selectedDay = this.selectedDay ?? Utils.mondayIndex(Utils.today());
      const monday = Utils.monday(Utils.today()), date = Utils.addDays(monday, selectedDay);
      const dateKey = Utils.dateKey(date), session = sessionForDay(selectedDay), log = logForDate(dateKey);
      Utils.$$('#week-strip [data-week-day]').forEach(button => {
        const selected = Number(button.dataset.weekDay) === selectedDay;
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', String(selected));
        button.setAttribute('aria-expanded', String(selected && this.detailsOpen));
      });
      const status = log.completed ? 'ĐÃ HOÀN THÀNH' : session ? 'CÓ LỊCH TẬP' : 'NGÀY NGHỈ';
      const tasks = session?.exercises?.length ? session.exercises.map(ex => {
        const sets = Utils.number(ex.sets), minutes = Utils.number(ex.minutes), reps = Utils.number(ex.reps);
        const details = [sets ? `${sets} hiệp` : '', minutes ? `${minutes} phút` : '', reps ? `${reps} lần/hiệp` : ''].filter(Boolean).join(' · ');
        return `<div class="week-day-task"><i class="mini-dot"></i><span><strong>${Utils.escape(ex.name)}</strong>${details ? `<small>${details}</small>` : ''}</span></div>`;
      }).join('') : session ? '<p class="week-day-empty">Buổi tập này chưa có nhiệm vụ. Bạn có thể thêm bài tập trong phần Lịch tập.</p>' : '<p class="week-day-empty">Ngày nghỉ — hãy dành thời gian hồi phục và chuẩn bị cho buổi tập tiếp theo.</p>';
      const details = $('#week-day-details');
      details.hidden = !this.detailsOpen;
      details.innerHTML = `<div class="week-day-detail-heading"><div><small>${Utils.fmtDate(date, { weekday: 'long', day: 'numeric', month: 'long' })}</small><strong>${Utils.escape(session?.title || 'Ngày nghỉ')}</strong>${session ? `<span>${Utils.number(session.exercises?.length)} nhiệm vụ · khoảng ${Utils.number(session.minutes)} phút</span>` : ''}</div><span class="status-pill ${log.completed ? 'complete' : ''}">${status}</span></div><div class="week-day-task-list">${tasks}</div>`;
    }
  };

  const Learner = {
    photoDraft: '',
    init() {
      $('#learner-edit-btn').addEventListener('click', () => this.open());
      $('#learner-form').addEventListener('submit', event => this.save(event));
      $('#learner-close').addEventListener('click', () => $('#learner-dialog').close());
      $('#learner-cancel').addEventListener('click', () => $('#learner-dialog').close());
      $('#learner-photo-input').addEventListener('change', event => this.choosePhoto(event));
      $('#profile-menu-btn').addEventListener('click', () => this.togglePopover());
      $('#learner-popover-edit').addEventListener('click', () => { this.closePopover(); this.open(); });
      document.addEventListener('click', event => {
        if (!event.target.closest('#profile-menu-btn, #learner-popover')) this.closePopover();
      });
      document.addEventListener('keydown', event => { if (event.key === 'Escape') this.closePopover(); });
      this.renderPopover();
    },
    renderAvatar(container, photoData, alt = 'Ảnh học viên') {
      if (!container) return;
      container.replaceChildren();
      if (/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(photoData || '')) {
        const image = document.createElement('img');
        image.src = photoData; image.alt = alt;
        image.addEventListener('error', () => this.renderAvatar(container, '', alt), { once: true });
        container.append(image); return;
      }
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('class', 'profile-icon'); icon.setAttribute('aria-hidden', 'true');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', '#icon-user'); icon.append(use); container.append(icon);
    },
    age(birthDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate || '')) return '—';
      const birth = Utils.parseDate(birthDate), today = Utils.today();
      if (!Number.isFinite(birth.getTime())) return '—';
      let years = today.getFullYear() - birth.getFullYear();
      if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) years--;
      return years >= 0 ? `${years} tuổi` : '—';
    },
    renderPopover() {
      const learner = state.learner || {}, hasLearner = Boolean(String(learner.fullName || '').trim());
      this.renderAvatar($('#profile-button-avatar'), learner.photoData, 'Ảnh cá nhân');
      this.renderAvatar($('#learner-popover-photo'), learner.photoData, 'Ảnh cá nhân');
      $('#learner-popover-name').textContent = hasLearner ? learner.fullName : 'Chưa có hồ sơ học viên';
      $('#learner-popover-caption').textContent = hasLearner ? 'Hồ sơ Taekwondo cá nhân' : 'Thêm thông tin để xem hồ sơ';
      $('#learner-popover-id').textContent = learner.studentId || '—';
      $('#learner-popover-age').textContent = this.age(learner.birthDate);
      $('#learner-popover-rank').textContent = learner.beltRank || '—';
      $('#learner-popover-edit').textContent = hasLearner ? '✎ Chỉnh sửa hồ sơ' : '＋ Thêm hồ sơ học viên';
    },
    togglePopover() {
      const popover = $('#learner-popover'), button = $('#profile-menu-btn');
      const isOpen = popover.hidden;
      popover.hidden = !isOpen; button.setAttribute('aria-expanded', String(isOpen));
    },
    closePopover() {
      const popover = $('#learner-popover'), button = $('#profile-menu-btn');
      if (!popover || !button) return;
      popover.hidden = true; button.setAttribute('aria-expanded', 'false');
    },
    async choosePhoto(event) {
      const file = event.target.files?.[0];
      if (!file) return;
      event.target.value = '';
      if (!file.type.startsWith('image/')) { UI.toast('Vui lòng chọn một tệp ảnh.', 'error'); event.target.value = ''; return; }
      if (file.size > 12 * 1024 * 1024) { UI.toast('Ảnh cần nhỏ hơn 12 MB.', 'error'); event.target.value = ''; return; }
      try {
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const image = await new Promise((resolve, reject) => {
          const preview = new Image(); preview.onload = () => resolve(preview); preview.onerror = reject; preview.src = dataUrl;
        });
        const scale = Math.min(1, 480 / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext('2d');
        context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        this.photoDraft = canvas.toDataURL('image/jpeg', 0.82);
        this.renderAvatar($('#learner-photo-preview'), this.photoDraft, 'Ảnh xem trước');
      } catch (error) {
        UI.toast('Không thể đọc ảnh này. Hãy thử chọn ảnh khác.', 'error');
      }
    },
    open() {
      const learner = state.learner || {};
      this.photoDraft = learner.photoData || '';
      this.renderAvatar($('#learner-photo-preview'), this.photoDraft, 'Ảnh xem trước');
      $('#learner-photo-input').value = '';
      $('#learner-student-id').value = learner.studentId || '';
      $('#learner-full-name').value = learner.fullName || '';
      $('#learner-birth-date').value = learner.birthDate || '';
      $('#learner-birth-date').max = Utils.dateKey();
      $('#learner-belt-rank').value = learner.beltRank || '';
      $('#learner-dialog').showModal();
    },
    save(event) {
      event.preventDefault();
      const learner = {
        studentId: $('#learner-student-id').value.trim(),
        fullName: $('#learner-full-name').value.trim(),
        birthDate: $('#learner-birth-date').value,
        beltRank: $('#learner-belt-rank').value.trim(),
        photoData: this.photoDraft || ''
      };
      if (!learner.studentId || !learner.fullName || !learner.birthDate || !learner.beltRank) {
        UI.toast('Vui lòng điền đầy đủ thông tin học viên.', 'error'); return;
      }
      if (learner.birthDate > Utils.dateKey()) {
        UI.toast('Ngày sinh không thể ở tương lai.', 'error'); return;
      }
      state.learner = learner;
      Storage.save();
      $('#learner-dialog').close();
      Home.render();
      this.renderPopover();
      UI.toast('Đã lưu hồ sơ học viên.');
    }
  };

  // Bộ đếm hiệp: đếm lùi, âm báo, rung và Wake Lock khi trình duyệt hỗ trợ.
  const RoundTimer = {
    interval: null, running: false, phase: 'ready', remaining: 180, phaseDuration: 180, round: 1, countdown: 0, warned: false, wakeLock: null,
    init() {
      this.loadControls();
      Utils.$$('[data-preset]').forEach(button => button.addEventListener('click', () => this.setPreset(button.dataset.preset)));
      ['warmup-input', 'round-input', 'rest-input', 'rounds-input'].forEach(id => $(`#${id}`).addEventListener('change', () => this.updateSettings()));
      $('#sound-toggle').addEventListener('change', () => this.updateSettings()); $('#vibrate-toggle').addEventListener('change', () => this.updateSettings());
      $('#timer-start').addEventListener('click', () => this.toggle()); $('#timer-skip').addEventListener('click', () => this.skip()); $('#timer-reset').addEventListener('click', () => this.reset());
      this.remaining = this.phaseDuration = state.timer.round; this.syncPresetSelection(); this.render();
    },
    loadControls() {
      const saved = state.timer;
      $('#warmup-input').value = saved.warmup; $('#round-input').value = saved.round; $('#rest-input').value = saved.rest; $('#rounds-input').value = saved.rounds;
      $('#sound-toggle').checked = saved.sound; $('#vibrate-toggle').checked = saved.vibrate;
    },
    config() { return state.timer; },
    updateSettings() {
      state.timer = {
        warmup: Math.max(0, Math.min(600, Utils.number($('#warmup-input').value, 30))),
        round: Math.max(5, Math.min(900, Utils.number($('#round-input').value, 180))),
        rest: Math.max(0, Math.min(600, Utils.number($('#rest-input').value, 60))),
        rounds: Math.max(1, Math.min(30, Utils.number($('#rounds-input').value, 3))),
        sound: $('#sound-toggle').checked, vibrate: $('#vibrate-toggle').checked
      };
      Storage.save(); this.syncPresetSelection(); if (!this.running) this.reset(false);
    },
    syncPresetSelection() {
      const t = state.timer;
      const matches = t.warmup === 30 && t.round === 180 && t.rest === 60 && t.rounds === 2 ? 'taekwondo' :
        t.warmup === 30 && t.round === 180 && t.rest === 60 && t.rounds === 3 ? 'boxing' :
        t.warmup === 0 && t.round === 20 && t.rest === 10 && t.rounds === 8 ? 'tabata' : 'custom';
      Utils.$$('[data-preset]').forEach(button => button.classList.toggle('active', button.dataset.preset === matches));
    },
    setPreset(preset, save = true) {
      const values = { boxing: [30, 180, 60, 3], taekwondo: [30, 180, 60, 2], tabata: [0, 20, 10, 8] };
      Utils.$$('[data-preset]').forEach(button => button.classList.toggle('active', button.dataset.preset === preset));
      if (values[preset]) {
        const [warmup, round, rest, rounds] = values[preset];
        $('#warmup-input').value = warmup; $('#round-input').value = round; $('#rest-input').value = rest; $('#rounds-input').value = rounds;
        this.updateSettings();
      } else if (preset === 'custom' && save) UI.toast('Bạn có thể chỉnh thời lượng ở bảng cài đặt.');
      if (!save) {
        this.remaining = state.timer.round; this.phaseDuration = state.timer.round; this.phase = 'ready'; this.round = 1; this.render();
      }
    },
    toggle() { if (this.running) this.pause(); else this.start(); },
    start() {
      if (this.phase === 'finished') this.reset(false);
      if (this.phase === 'ready') { this.phase = 'countdown'; this.countdown = 3; this.showCounter(); }
      this.running = true; $('#timer-start').textContent = 'Ⅱ Tạm dừng'; this.acquireWakeLock();
      this.interval = setInterval(() => this.tick(), 1000); this.render();
    },
    tick() {
      if (this.phase === 'countdown') {
        this.countdown -= 1;
        if (this.countdown <= 0) { this.beginFirstPhase(); return; }
        this.showCounter(); this.beep(720, 70); this.vibrate(50); return;
      }
      if (this.remaining > 0) this.remaining -= 1;
      if (this.remaining === 10 && !this.warned) { this.warned = true; this.beep(880, 120); this.vibrate([80, 50, 80]); }
      if (this.remaining <= 0) this.advancePhase();
      this.render();
    },
    beginFirstPhase() {
      this.phase = this.config().warmup > 0 ? 'warmup' : 'round'; this.remaining = this.phaseDuration = this.phase === 'warmup' ? this.config().warmup : this.config().round;
      this.warned = false; this.signal(); this.render();
    },
    advancePhase() {
      const config = this.config();
      this.warned = false;
      if (this.phase === 'warmup') { this.phase = 'round'; this.round = 1; this.remaining = this.phaseDuration = config.round; this.signal(); return; }
      if (this.phase === 'round') {
        if (this.round >= config.rounds) { this.phase = 'finished'; this.remaining = 0; this.phaseDuration = 1; this.finish(); return; }
        if (config.rest > 0) { this.phase = 'rest'; this.remaining = this.phaseDuration = config.rest; }
        else { this.round += 1; this.remaining = this.phaseDuration = config.round; }
        this.signal(); return;
      }
      if (this.phase === 'rest') { this.round += 1; this.phase = 'round'; this.remaining = this.phaseDuration = config.round; this.signal(); }
    },
    skip() {
      if (this.phase === 'ready' || this.phase === 'finished') return;
      if (this.phase === 'countdown') { this.beginFirstPhase(); return; }
      this.remaining = 0; this.advancePhase(); this.render();
    },
    pause() { this.running = false; clearInterval(this.interval); this.interval = null; $('#timer-start').textContent = '▶ Tiếp tục'; this.releaseWakeLock(); this.render(); },
    reset(persist = true) {
      clearInterval(this.interval); this.interval = null; this.running = false; this.phase = 'ready'; this.round = 1; this.remaining = this.phaseDuration = state.timer.round; this.warned = false; this.countdown = 0;
      $('#timer-start').textContent = '▶ Bắt đầu'; this.releaseWakeLock(); this.render(); if (persist) Storage.save();
    },
    finish() { this.running = false; clearInterval(this.interval); this.interval = null; $('#timer-start').textContent = '↺ Bắt đầu lại'; this.beep(960, 300); this.vibrate([120, 70, 120, 70, 240]); this.releaseWakeLock(); UI.toast('Hoàn thành tất cả các hiệp!'); this.render(); },
    signal() { this.beep(this.phase === 'rest' ? 500 : 760, 200); this.vibrate([100, 60, 100]); },
    beep(frequency = 760, duration = 150) {
      if (!this.config().sound) return;
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext; if (!AudioContextClass) return;
        const context = new AudioContextClass(), oscillator = context.createOscillator(), gain = context.createGain();
        oscillator.frequency.value = frequency; oscillator.type = 'sine'; gain.gain.setValueAtTime(.08, context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration / 1000);
        oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + duration / 1000); oscillator.onended = () => context.close();
      } catch (error) { /* Âm thanh có thể bị chặn trước tương tác người dùng. */ }
    },
    vibrate(pattern) { if (this.config().vibrate && navigator.vibrate) navigator.vibrate(pattern); },
    async acquireWakeLock() {
      if (!('wakeLock' in navigator)) { $('#wake-status').textContent = 'Màn hình sáng khi đồng hồ chạy (nếu thiết bị hỗ trợ)'; return; }
      try { this.wakeLock = await navigator.wakeLock.request('screen'); $('#wake-status').textContent = '◉ Đang giữ màn hình sáng'; }
      catch (error) { $('#wake-status').textContent = 'Thiết bị chưa cho phép giữ màn hình sáng'; }
    },
    async releaseWakeLock() { if (this.wakeLock) { try { await this.wakeLock.release(); } catch (error) { /* Đã được giải phóng */ } this.wakeLock = null; } $('#wake-status').textContent = '◉ Màn hình sáng khi đồng hồ chạy'; },
    showCounter() { $('#timer-counter').textContent = this.phase === 'countdown' ? String(this.countdown) : ''; },
    render() {
      const phaseLabels = { ready: 'SẴN SÀNG', countdown: 'CHUẨN BỊ', warmup: 'KHỞI ĐỘNG', round: 'ĐANG TẬP', rest: 'NGHỈ HIỆP', finished: 'HOÀN THÀNH' };
      const phaseCaptions = { ready: 'Tập trung vào nhịp thở', countdown: 'Bắt đầu sau', warmup: 'Làm nóng cơ thể', round: 'Giữ nhịp · giữ thủ', rest: 'Thả lỏng và hồi phục', finished: 'Bạn đã hoàn thành buổi tập' };
      $('#timer-phase').textContent = phaseLabels[this.phase] || 'SẴN SÀNG';
      $('#timer-card').classList.toggle('phase-rest', this.phase === 'rest'); $('#timer-card').classList.toggle('phase-warmup', this.phase === 'warmup'); $('#timer-card').classList.toggle('phase-finished', this.phase === 'finished');
      const shown = this.phase === 'countdown' ? this.countdown : this.remaining;
      $('#timer-clock').textContent = `${String(Math.floor(shown / 60)).padStart(2, '0')}:${String(shown % 60).padStart(2, '0')}`;
      $('#round-label').textContent = `HIỆP ${Math.min(this.round, this.config().rounds)} / ${this.config().rounds}`;
      $('#timer-caption').textContent = phaseCaptions[this.phase];
      $('#timer-counter').textContent = this.phase === 'ready' ? 'SẴN SÀNG VÀO HIỆP' : this.phase === 'countdown' ? 'HÍT THỞ · CHUẨN BỊ' : this.phase === 'finished' ? 'TỐT LẮM · HỒI PHỤC' : this.remaining <= 10 && this.remaining > 0 ? '10 GIÂY CUỐI' : '';
      const ratio = this.phase === 'countdown' ? this.countdown / 3 : this.phaseDuration ? this.remaining / this.phaseDuration : 1;
      $('#timer-progress').style.strokeDashoffset = String(804.25 * (1 - Math.max(0, Math.min(1, ratio))));
    }
  };

  // Dinh dưỡng: ước tính năng lượng, macro, bữa ăn, nước và cân nặng.
  const Nutrition = {
    activeMeal: state.nutrition.activeMeal || 'Sáng',
    init() {
      $('#nutrition-edit').addEventListener('click', () => this.openProfile());
      $('#profile-form').addEventListener('submit', event => this.saveProfile(event));
      $('#profile-close').addEventListener('click', () => $('#profile-dialog').close());
      $('#profile-cancel').addEventListener('click', () => $('#profile-dialog').close());
      $('#nutrition-day-type').addEventListener('change', () => this.render());
      $('#meal-tabs').addEventListener('click', event => {
        const button = event.target.closest('[data-meal]'); if (!button) return;
        this.activeMeal = button.dataset.meal; state.nutrition.activeMeal = this.activeMeal; Storage.save(); this.renderMeals();
      });
      $('#meal-form').addEventListener('submit', event => this.addMeal(event));
      $('#meal-list').addEventListener('click', event => {
        const button = event.target.closest('[data-remove-meal]'); if (!button) return;
        const mealData = this.getDayMeals(); mealData[this.activeMeal] = (mealData[this.activeMeal] || []).filter(item => item.id !== button.dataset.removeMeal);
        Storage.save(); this.render();
      });
      $('#clear-meals').addEventListener('click', () => { const meals = this.getDayMeals(); meals[this.activeMeal] = []; Storage.save(); this.render(); UI.toast(`Đã xóa bữa ${this.activeMeal.toLowerCase()} hôm nay.`); });
      $('#custom-food-btn').addEventListener('click', () => this.addCustomFood());
      $('#water-plus').addEventListener('click', () => this.changeWater(1)); $('#water-minus').addEventListener('click', () => this.changeWater(-1));
      $('#weight-add-btn').addEventListener('click', () => this.addWeight());
      this.render();
    },
    openProfile() {
      const profile = state.nutrition.profile || {};
      $('#profile-height').value = profile.height || ''; $('#profile-weight').value = profile.weight || '';
      $('#profile-age').value = profile.age || ''; $('#profile-sex').value = profile.sex || 'female';
      $('#profile-activity').value = profile.activity || '1.55'; $('#profile-goal').value = profile.goal || 'maintain';
      $('#profile-dialog').showModal();
    },
    saveProfile(event) {
      event.preventDefault();
      const previousWeight = Utils.number(state.nutrition.profile?.weight, 0);
      const profile = {
        height: Utils.number($('#profile-height').value), weight: Utils.number($('#profile-weight').value), age: Utils.number($('#profile-age').value),
        sex: $('#profile-sex').value, activity: Utils.number($('#profile-activity').value, 1.55), goal: $('#profile-goal').value
      };
      if (profile.height < 100 || profile.weight < 30 || profile.age < 14) { UI.toast('Nhập chiều cao, cân nặng và tuổi hợp lệ.', 'error'); return; }
      state.nutrition.profile = profile;
      if (profile.weight && profile.weight !== previousWeight) {
        state.nutrition.weights.push({ date: Utils.dateKey(), weight: profile.weight });
        state.nutrition.weights = state.nutrition.weights.slice(-60);
      }
      Storage.save(); $('#profile-dialog').close(); this.render(); UI.toast('Đã lưu hồ sơ dinh dưỡng.');
    },
    estimates() {
      const p = state.nutrition.profile || {};
      if (!p.height || !p.weight || !p.age) return null;
      const bmr = Math.round(10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === 'male' ? 5 : -161));
      const tdee = Math.round(bmr * Utils.number(p.activity, 1.55));
      let adjustment = 0;
      if (p.goal === 'lose') adjustment = -300;
      if (p.goal === 'gain') adjustment = 200;
      if (p.goal === 'class') adjustment = -150;
      const base = Math.max(bmr, tdee + adjustment);
      return { bmr, tdee, training: Math.max(bmr, base + 100), rest: Math.max(bmr, base - 100), base };
    },
    targets(dayType = $('#nutrition-day-type').value) {
      const estimates = this.estimates(), weight = Utils.number(state.nutrition.profile?.weight, 68);
      if (!estimates) return { kcal: 0, protein: 0, carbs: 0, fat: 0 };
      const kcal = dayType === 'rest' ? estimates.rest : estimates.training;
      const protein = Math.round(weight * 1.8), fat = Math.round(weight * .8);
      const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
      return { kcal, protein, carbs, fat };
    },
    getDayMeals() {
      const key = Utils.dateKey();
      if (!state.nutrition.meals[key]) state.nutrition.meals[key] = { Sáng: [], Trưa: [], Tối: [], Phụ: [] };
      for (const meal of MEALS) if (!Array.isArray(state.nutrition.meals[key][meal])) state.nutrition.meals[key][meal] = [];
      return state.nutrition.meals[key];
    },
    foods() { return [...FOOD_LIBRARY, ...(state.nutrition.foods || [])]; },
    foodById(id) { return this.foods().find(food => food.id === id); },
    addMeal(event) {
      event.preventDefault();
      const food = this.foodById($('#food-select').value), servings = Math.max(.25, Utils.number($('#food-servings').value, 1));
      if (!food) { UI.toast('Chọn món ăn trong thư viện.', 'error'); return; }
      const meals = this.getDayMeals(); meals[this.activeMeal].push({ id: uid('meal'), foodId: food.id, servings });
      Storage.save(); this.render(); UI.toast(`Đã thêm ${food.name} vào bữa ${this.activeMeal.toLowerCase()}.`);
    },
    addCustomFood() {
      const name = window.prompt('Tên món ăn tự tạo:'); if (!name?.trim()) return;
      const kcal = Utils.number(window.prompt('Năng lượng (kcal) cho một khẩu phần:', '200'), -1);
      if (kcal < 0) { UI.toast('Giá trị calo chưa hợp lệ.', 'error'); return; }
      const protein = Math.max(0, Utils.number(window.prompt('Đạm (g):', '15'), 0));
      const carbs = Math.max(0, Utils.number(window.prompt('Tinh bột (g):', '25'), 0));
      const fat = Math.max(0, Utils.number(window.prompt('Chất béo (g):', '5'), 0));
      state.nutrition.foods.push({ id: uid('food'), name: name.trim(), emoji: '🍽️', kcal, protein, carbs, fat, custom: true });
      Storage.save(); this.render(); UI.toast(`Đã lưu món “${name.trim()}” vào thư viện của bạn.`);
    },
    changeWater(delta) {
      const key = Utils.dateKey(); state.nutrition.water[key] = Math.max(0, Math.min(20, Utils.number(state.nutrition.water[key]) + delta));
      Storage.save(); this.render();
    },
    addWeight() {
      const current = Utils.number(state.nutrition.profile?.weight, 0);
      const value = Utils.number(window.prompt('Cân nặng hiện tại (kg):', current || ''), 0);
      if (value < 30 || value > 250) { UI.toast('Nhập cân nặng trong khoảng 30–250 kg.', 'error'); return; }
      state.nutrition.weights.push({ date: Utils.dateKey(), weight: value }); state.nutrition.profile.weight = value;
      Storage.save(); this.render(); UI.toast('Đã ghi lại cân nặng.');
    },
    render() {
      const estimates = this.estimates();
      if (estimates) {
        $('#bmr-value').textContent = estimates.bmr.toLocaleString('vi-VN'); $('#tdee-value').textContent = estimates.tdee.toLocaleString('vi-VN');
        const goalName = { maintain: 'giữ cân', lose: 'giảm cân', gain: 'tăng cân', class: 'giữ hạng cân' }[state.nutrition.profile.goal] || 'cân bằng';
        $('#nutrition-goal-note').textContent = `Mục tiêu ${goalName}: ngày tập ${estimates.training.toLocaleString('vi-VN')} kcal · ngày nghỉ ${estimates.rest.toLocaleString('vi-VN')} kcal. Mức đề xuất không thấp hơn BMR.`;
      } else {
        $('#bmr-value').textContent = '—'; $('#tdee-value').textContent = '—';
        $('#nutrition-goal-note').textContent = 'Hoàn thiện chiều cao, cân nặng và tuổi trong hồ sơ để xem ước tính. Không đề xuất mức calo dưới BMR.';
      }
      this.renderMeals(); this.renderWeightChart();
    },
    renderMeals() {
      const foods = this.foods();
      $('#food-select').innerHTML = foods.map(food => `<option value="${food.id}">${food.emoji || '🍽️'} ${Utils.escape(food.name)} · ${food.kcal} kcal</option>`).join('');
      Utils.$$('#meal-tabs button').forEach(button => button.classList.toggle('selected', button.dataset.meal === this.activeMeal));
      const meals = this.getDayMeals();
      const daily = MEALS.flatMap(meal => meals[meal] || []).reduce((sum, item) => {
        const food = this.foodById(item.foodId); if (!food) return sum;
        for (const key of ['kcal', 'protein', 'carbs', 'fat']) sum[key] += Utils.number(food[key]) * item.servings;
        return sum;
      }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });
      const targets = this.targets();
      $('#calories-eaten').textContent = Math.round(daily.kcal).toLocaleString('vi-VN');
      $('#calorie-target').textContent = targets.kcal ? `${targets.kcal.toLocaleString('vi-VN')} kcal` : 'Hoàn thiện hồ sơ';
      $('#calorie-remaining').textContent = targets.kcal ? `${Math.max(0, Math.round(targets.kcal - daily.kcal)).toLocaleString('vi-VN')} kcal` : '—';
      const angle = targets.kcal ? Math.min(360, daily.kcal / targets.kcal * 360) : 0;
      $('#calorie-ring').style.setProperty('--calorie-angle', `${angle}deg`);
      const macros = [['Đạm', 'protein', 'protein'], ['Tinh bột', 'carbs', 'carb'], ['Béo', 'fat', 'fat']];
      $('#macro-progress').innerHTML = macros.map(([label, key, klass]) => {
        const target = targets[key], consumed = Math.round(daily[key]); const percent = target ? Math.min(100, consumed / target * 100) : 0;
        return `<div class="macro-row ${klass}"><span>${label}</span><div class="macro-bar"><i style="width:${percent}%"></i></div><strong>${consumed} / ${target || '—'} g</strong></div>`;
      }).join('');
      $('#water-count').textContent = Utils.number(state.nutrition.water[Utils.dateKey()]);
      $('#meal-list').innerHTML = (meals[this.activeMeal] || []).map(item => {
        const food = this.foodById(item.foodId); if (!food) return '';
        return `<div class="meal-item"><span class="meal-emoji">${food.emoji || '🍽️'}</span><div><strong>${Utils.escape(food.name)}</strong><small>${item.servings} khẩu phần · Đạm ${Math.round(food.protein * item.servings)}g · Carb ${Math.round(food.carbs * item.servings)}g · Béo ${Math.round(food.fat * item.servings)}g</small></div><span class="meal-kcal">${Math.round(food.kcal * item.servings)}<small> kcal</small></span><button class="meal-delete" data-remove-meal="${item.id}" aria-label="Xóa món">×</button></div>`;
      }).join('') || '<div class="recent-empty">Chưa ghi món ăn cho bữa này.</div>';
    },
    renderWeightChart() {
      const points = (state.nutrition.weights || []).slice(-12);
      if (points.length < 2) { $('#weight-chart').innerHTML = points.length ? `<div class="weight-chart-empty">Gần nhất: ${points[0].weight} kg · Thêm lần cân tiếp theo để xem biểu đồ.</div>` : '<div class="weight-chart-empty">Chưa ghi cân nặng. Dữ liệu sẽ hiện tại đây.</div>'; return; }
      const values = points.map(item => Number(item.weight)), min = Math.min(...values) - .5, max = Math.max(...values) + .5;
      const coords = values.map((value, index) => `${12 + index * 276 / (values.length - 1)},${52 - ((value - min) / (max - min || 1)) * 42}`).join(' ');
      $('#weight-chart').innerHTML = `<svg viewBox="0 0 300 60" role="img" aria-label="Biểu đồ cân nặng"><polyline points="${coords}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></polyline>${values.map((value, index) => `<circle cx="${12 + index * 276 / (values.length - 1)}" cy="${52 - ((value - min) / (max - min || 1)) * 42}" r="3" fill="var(--accent)" title="${value} kg"></circle>`).join('')}</svg>`;
    }
  };

  // Thống kê từ các buổi đã đánh dấu hoàn thành.
  const Stats = {
    init() { $('#stats-range').addEventListener('change', () => this.render()); this.render(); },
    currentStreak() {
      const done = new Set(completedKeys()); let cursor = Utils.today();
      if (!done.has(Utils.dateKey(cursor))) cursor = Utils.addDays(cursor, -1);
      if (!done.has(Utils.dateKey(cursor))) return 0;
      let count = 0;
      while (done.has(Utils.dateKey(cursor)) && count < 366) { count++; cursor = Utils.addDays(cursor, -1); }
      return count;
    },
    render() {
      const range = Utils.number($('#stats-range')?.value, 30), today = Utils.today();
      const entries = [];
      for (let i = range - 1; i >= 0; i--) {
        const date = Utils.addDays(today, -i), key = Utils.dateKey(date), log = logForDate(key);
        entries.push({ date, key, done: Boolean(log.completed), minutes: log.completed ? totalSessionMinutes(key, log) : 0 });
      }
      const doneEntries = entries.filter(entry => entry.done), totalMinutes = doneEntries.reduce((sum, entry) => sum + entry.minutes, 0);
      const averages = doneEntries.length ? Math.round(totalMinutes / doneEntries.length) : 0;
      $('#stats-overview').innerHTML = [
        ['◷', 'Buổi hoàn thành', `${doneEntries.length}`, 'buổi', ''], ['⏱', 'Tổng thời gian', totalMinutes >= 60 ? (totalMinutes / 60).toFixed(1) : totalMinutes, totalMinutes >= 60 ? 'giờ' : 'phút', 'orange'],
        ['↗', 'Trung bình / buổi', `${averages}`, 'phút', 'blue'], ['🔥', 'Streak', `${this.currentStreak()}`, 'ngày', 'rose']
      ].map(([icon, label, value, unit, color]) => `<div class="stat-card"><span class="stat-icon ${color}">${icon}</span><div><small>${label}</small><strong>${value}</strong><em>${unit}</em></div></div>`).join('');
      this.renderChart(entries, range);
      $('#streak-value').textContent = this.currentStreak();
      $('#streak-message').textContent = this.currentStreak() ? 'Thật tốt khi bạn đang giữ nhịp đều.' : 'Ghi nhận buổi tập để bắt đầu streak.';
      const trailing = [...Array(7)].map((_, index) => Utils.addDays(today, index - 6));
      $('#streak-dots').innerHTML = trailing.map(date => `<i class="${logForDate(Utils.dateKey(date)).completed ? 'active' : ''}" title="${Utils.dateKey(date)}"></i>`).join('');
      const recent = completedKeys().sort().reverse().slice(0, 5);
      $('#recent-activity').innerHTML = recent.length ? recent.map(key => {
        const session = sessionForDay(Utils.mondayIndex(Utils.parseDate(key)));
        return `<div class="recent-item"><span class="recent-icon">🥋</span><div><strong>${Utils.escape(session?.title || 'Buổi tập cá nhân')}</strong><small>${totalSessionMinutes(key)} phút tập luyện</small></div><time>${Utils.fmtDate(Utils.parseDate(key), { day: 'numeric', month: 'short' })}</time></div>`;
      }).join('') : '<div class="recent-empty">Chưa có buổi tập hoàn thành. Lịch sử sẽ hiện ở đây.</div>';
      const totalSparring = state.sparring.length;
      const wins = state.sparring.filter(item => item.result === 'Thắng').length;
      const completedSparring = state.sparring.filter(item => item.result === 'Hoàn thành').length;
      $('#sparring-summary').innerHTML = `<div class="sparring-stats"><div><strong>${totalSparring}</strong><small>buổi ghi nhận</small></div><div><strong>${wins}</strong><small>trận thắng</small></div><div><strong>${completedSparring}</strong><small>hoàn thành</small></div></div>`;
    },
    renderChart(entries, range) {
      const groupSize = range <= 30 ? 1 : range <= 90 ? 3 : 7, buckets = [];
      for (let i = 0; i < entries.length; i += groupSize) {
        const group = entries.slice(i, i + groupSize);
        buckets.push({ label: group[0].date, minutes: group.reduce((sum, entry) => sum + entry.minutes, 0), count: group.filter(entry => entry.done).length });
      }
      const width = 700, height = 175, left = 22, right = 8, top = 12, bottom = 26, chartHeight = height - top - bottom;
      const max = Math.max(30, ...buckets.map(item => item.minutes)); const slot = (width - left - right) / Math.max(1, buckets.length); const barWidth = Math.max(2, Math.min(18, slot * .58));
      const bars = buckets.map((item, index) => {
        const barHeight = item.minutes ? Math.max(3, item.minutes / max * chartHeight) : 0, x = left + index * slot + (slot - barWidth) / 2, y = top + chartHeight - barHeight;
        const label = range <= 30 ? item.label.getDate() : range <= 90 ? Utils.fmtDate(item.label, { day: 'numeric', month: 'short' }) : Utils.fmtDate(item.label, { month: 'short' });
        const showLabel = buckets.length <= 14 || index % Math.ceil(buckets.length / 12) === 0 || index === buckets.length - 1;
        return `${barHeight ? `<rect class="chart-bar" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" opacity=".88"><title>${Utils.fmtDate(item.label, { day: 'numeric', month: 'short' })}: ${item.minutes} phút</title></rect>` : ''}${showLabel ? `<text class="chart-label" x="${x + barWidth / 2}" y="${height - 6}" text-anchor="middle">${label}</text>` : ''}`;
      }).join('');
      const grid = [0, .5, 1].map(ratio => { const y = top + chartHeight * ratio; return `<line class="chart-gridline" x1="${left}" x2="${width - right}" y1="${y}" y2="${y}"></line><text class="chart-value" x="0" y="${y + 3}">${Math.round(max * (1 - ratio))}</text>`; }).join('');
      $('#training-chart').innerHTML = `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="Biểu đồ phút tập theo ngày">${grid}${bars}</svg>`;
    }
  };

  // Cài đặt cá nhân, xuất và nhập dữ liệu JSON.
  const App = {
    init() {
      window.addEventListener('hashchange', () => {
        const tab = window.location.hash.replace(/^#/, '');
        if (UI.validTabs.includes(tab) && tab !== UI.currentTab) UI.setTab(tab, true, false);
      });
      UI.applySettings();
      Utils.$$('[data-tab]').forEach(button => button.addEventListener('click', event => { event.preventDefault(); UI.setTab(button.dataset.tab); }));
      $('#theme-select').addEventListener('change', event => { state.settings.theme = event.target.value; UI.applySettings(); Storage.save(); });
      $('#mode-toggle').addEventListener('click', () => { state.settings.mode = state.settings.mode === 'dark' ? 'light' : 'dark'; UI.applySettings(); Storage.save(); });
      $('#font-toggle').addEventListener('click', () => { const cycle = { normal: 'large', large: 'small', small: 'normal' }; state.settings.font = cycle[state.settings.font] || 'normal'; UI.applySettings(); Storage.save(); });
      $('#export-btn').addEventListener('click', () => this.exportData());
      $('#import-file').addEventListener('change', event => this.importData(event));
      Learner.init();
      Schedule.init(); Tracker.init(); RoundTimer.init(); Nutrition.init(); Stats.init();
      Home.init();
      Home.render();
    },
    exportData() {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob), link = document.createElement('a');
      link.href = url; link.download = `nhip-vo-du-lieu-${Utils.dateKey()}.json`; document.body.append(link); link.click(); link.remove(); URL.revokeObjectURL(url);
      UI.toast('Đã xuất dữ liệu JSON.');
    },
    importData(event) {
      const file = event.target.files?.[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const imported = JSON.parse(String(reader.result));
          if (!imported || typeof imported !== 'object' || !Array.isArray(imported.schedule) || typeof imported.logs !== 'object') throw new Error('Định dạng dữ liệu không hợp lệ.');
          const safeSchedule = imported.schedule.filter(item => item && Number.isInteger(Number(item.day)) && Number(item.day) >= 0 && Number(item.day) <= 6).map(item => ({ ...item, id: String(item.id || uid('session')), exercises: Array.isArray(item.exercises) ? item.exercises : [] }));
          state = Storage.normalize({ ...imported, schedule: safeSchedule });
          Storage.save();
          // Cập nhật các phần hiển thị, giữ nguyên trang đang mở.
          UI.applySettings(); Schedule.loadPlannerControls(); Schedule.render(); Tracker.render(); Tracker.renderSparring(); RoundTimer.loadControls(); RoundTimer.reset(false); Nutrition.activeMeal = state.nutrition.activeMeal || 'Sáng'; Nutrition.render(); Stats.render(); Home.render();
          UI.toast('Đã nhập dữ liệu thành công.');
        } catch (error) { UI.toast(`Không thể nhập tệp: ${error.message}`, 'error'); }
        event.target.value = '';
      };
      reader.onerror = () => UI.toast('Không thể đọc tệp đã chọn.', 'error');
      reader.readAsText(file);
    }
  };

  App.init();
})();
