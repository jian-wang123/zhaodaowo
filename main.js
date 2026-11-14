/* ============================================================
   《找到我》公共脚本
   按页面中是否存在对应元素，自动执行该页面的逻辑
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 通用弹窗 ---------- */
  function showDialog(text) {
    var mask = document.getElementById('dialogMask');
    var txt  = document.getElementById('dialogText');
    if (!mask || !txt) return;
    txt.textContent = text;
    mask.classList.add('show');
  }
  // 绑定弹窗关闭
  (function bindDialog() {
    var mask = document.getElementById('dialogMask');
    var ok   = document.getElementById('dialogOk');
    if (!mask || !ok) return;
    ok.addEventListener('click', function () { mask.classList.remove('show'); });
    mask.addEventListener('click', function (e) {
      if (e.target === mask) mask.classList.remove('show');
    });
  })();


  /* ---------- 页面1：论坛文字轻微闪烁 ---------- */
  (function forumFlicker() {
    if (!document.getElementById('page-forum')) return;
    function tick() {
      var els = document.querySelectorAll('#page-forum .flicker');
      if (els.length) {
        var el = els[Math.floor(Math.random() * els.length)];
        el.style.opacity = '0.55';
        setTimeout(function () { el.style.opacity = '1'; }, 130 + Math.random() * 130);
      }
      setTimeout(tick, 2400 + Math.random() * 2600);
    }
    tick();
  })();


  /* ---------- 页面2：时光回溯站 ---------- */
  (function archivePage() {
    var urlInput   = document.getElementById('urlInput');
    var btnFetch   = document.getElementById('btnFetch');
    var loadingBox = document.getElementById('archiveLoading');
    if (!urlInput || !btnFetch || !loadingBox) return;

    var TARGET_URL = 'wangjian-0328-guxing.vn.com';   // 唯一正确网址

    function fetchSnapshot() {
      if (urlInput.value !== TARGET_URL) {
        showDialog('未检索到快照，该记录已被抹除');
        return;
      }
      btnFetch.disabled = true;
      urlInput.disabled = true;
      loadingBox.classList.add('show');

      setTimeout(function () {
        window.location.href = 'blog.html';   // 跳转到博客
      }, 2000);
    }

    btnFetch.addEventListener('click', fetchSnapshot);
    urlInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') fetchSnapshot();
    });
  })();


  /* ---------- 页面3：顾星博客 ---------- */
  (function blogPage() {
    if (!document.getElementById('page-blog')) return;

    /* 1. 生成星空 */
    (function buildStars() {
      var field = document.getElementById('starfield');
      if (!field) return;
      var frag = document.createDocumentFragment();
      for (var i = 0; i < 80; i++) {
        var s = document.createElement('div');
        s.className = 'star';
        var size = 1 + Math.random() * 1.8;
        s.style.width  = size + 'px';
        s.style.height = size + 'px';
        s.style.left   = (Math.random() * 100) + '%';
        s.style.top    = (Math.random() * 100) + '%';
        s.style.animationDuration = (7 + Math.random() * 11) + 's';
        s.style.animationDelay    = (-Math.random() * 12) + 's';
        frag.appendChild(s);
      }
      field.appendChild(frag);
    })();

    /* 2. 导航切换 */
    var navItems = document.querySelectorAll('.nav-item');
    Array.prototype.forEach.call(navItems, function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        Array.prototype.forEach.call(navItems, function (n) { n.classList.remove('active'); });
        item.classList.add('active');
        var panels = document.querySelectorAll('.blog-panel');
        Array.prototype.forEach.call(panels, function (p) { p.classList.remove('active'); });
        var target = document.getElementById('panel-' + item.dataset.tab);
        if (target) target.classList.add('active');
      });
    });

    /* 3. 局部文字随机乱码 */
    var GLITCH_CHARS = '▓▒░█▚▞▙';
    var glitchTargets = Array.prototype.slice.call(
      document.querySelectorAll('#page-blog .glitchable')
    );
    glitchTargets.forEach(function (el) { el.dataset.orig = el.textContent; });

    function glitchOnce() {
      if (glitchTargets.length) {
        var el = glitchTargets[Math.floor(Math.random() * glitchTargets.length)];
        var orig = el.dataset.orig || '';
        if (orig) {
          var chars = orig.split('');
          var count = 1 + Math.floor(Math.random() * 2);
          for (var i = 0; i < count; i++) {
            var idx = Math.floor(Math.random() * chars.length);
            if (chars[idx] === ' ' || chars[idx] === '\n') continue;
            chars[idx] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          }
          el.textContent = chars.join('');
          setTimeout(function () { el.textContent = orig; }, 160 + Math.random() * 160);
        }
      }
      setTimeout(glitchOnce, 6000 + Math.random() * 7000);
    }
    glitchOnce();

    /* 4. 访客计数器小幅跳动 */
    var visitTotalEl = document.getElementById('visitTotal');
    var visitTodayEl = document.getElementById('visitToday');
    function tickVisitors() {
      if (visitTotalEl) visitTotalEl.textContent = String(1086 + Math.floor(Math.random() * 7) - 3);
      if (visitTodayEl) visitTodayEl.textContent = String(12 + Math.floor(Math.random() * 5) - 2);
      setTimeout(tickVisitors, 2100 + Math.random() * 2400);
    }
    tickVisitors();
  })();


  /* ---------- 页面4：后台答题与结局 ---------- */
  (function adminPage() {
    var wrap = document.getElementById('questionsWrap');
    var submitBtn = document.getElementById('submitAnswers');
    if (!wrap || !submitBtn) return;

    /* 题库：可自行修改题目、选项、答案 */
    var QUESTIONS = [
      { q: '顾星最好的朋友是谁？', options: ['阿泽', '林屿', '小远', '阿辰'], answer: 'B' },
      { q: '顾星是什么时间彻底消失的？', options: ['9月20日', '9月23日', '9月28日', '10月1日'], answer: 'C' },
      { q: '谁还能记得即将被抹除的顾星？', options: ['全班同学', '老师', '林屿', '陌生人'], answer: 'C' },
      { q: '顾星消失的原因是什么？', options: ['搬家转学', '世界遗忘抹除机制', '外出旅游', '离家出走'], answer: 'B' },
      { q: '留言板匿名留言写了什么？', options: ['记得按时回家', '所有人遗忘你，你就会被世界删除', '有空一起玩', '保重身体'], answer: 'B' },
      { q: '顾星博客是什么年份搭建的？', options: ['2013', '2015', '2018', '2020'], answer: 'B' },
      { q: '玩家在哪个论坛发帖求助？', options: ['星宇论坛', '辛巴论坛', '晚风论坛', '旧忆论坛'], answer: 'B' },
      { q: '解锁博客需要进入哪个站点调取网页快照？', options: ['时光回溯站', '历史档案馆', '旧网页库', '回忆站点'], answer: 'A' },
      { q: '坏结局的名字叫什么？', options: ['微光结局', '归零结局', '遗忘结局', '消散结局'], answer: 'B' },
      { q: '顾星送给林屿的东西最后怎么样了？', options: ['被别人拿走', '全部凭空消失', '保存完好', '被弄丢'], answer: 'B' }
    ];
    var LETTERS = ['A', 'B', 'C', 'D'];

    /* 渲染题目 */
    var html = '';
    QUESTIONS.forEach(function (q, i) {
      html += '<div class="question-block">';
      html += '<div class="q-title">' + (i + 1) + '. ' + q.q + '</div>';
      html += '<div class="q-options">';
      LETTERS.forEach(function (letter, j) {
        html += '<label class="q-option">';
        html += '<input type="radio" name="q' + i + '" value="' + letter + '">';
        html += '<span>' + letter + '. ' + q.options[j] + '</span>';
        html += '</label>';
      });
      html += '</div></div>';
    });
    wrap.innerHTML = html;

    /* 提交判定 */
    submitBtn.addEventListener('click', function () {
      var correct = 0;
      QUESTIONS.forEach(function (q, i) {
        var sel = document.querySelector('input[name="q' + i + '"]:checked');
        if (sel && sel.value === q.answer) correct++;
      });
      showEnding(correct);
    });

    /* 结局 */
    function showEnding(correct) {
      var overlay    = document.getElementById('endingOverlay');
      var overlayText= document.getElementById('endingText');
      var restartBtn = document.getElementById('endingRestart');

      overlay.className = 'ending-overlay';
      overlayText.textContent = '';
      overlayText.className = 'ending-text';
      restartBtn.classList.remove('show');
      document.body.classList.add('ending-active');

      var adminEl = document.getElementById('page-admin');

      if (correct >= 6) {
        /* 微光结局 */
        overlay.classList.add('show', 'good');
        setTimeout(function () {
          overlay.classList.add('fade-in');
          setTimeout(function () {
            overlayText.textContent = '你找到我了，谢谢你还记得我。';
            overlayText.classList.add('visible');
            setTimeout(function () { restartBtn.classList.add('show'); }, 2200);
          }, 1400);
        }, 120);
      } else {
        /* 归零结局 */
        if (adminEl) adminEl.classList.add('glitching');
        overlay.classList.add('show', 'bad');
        setTimeout(function () {
          overlay.classList.add('fade-in');
          setTimeout(function () {
            overlayText.textContent = '最终，你也慢慢忘了。';
            overlayText.classList.add('visible');
            setTimeout(function () { restartBtn.classList.add('show'); }, 2200);
          }, 1400);
        }, 120);
      }
    }

    /* 重新开始 */
    var restartBtn = document.getElementById('endingRestart');
    if (restartBtn) {
      restartBtn.addEventListener('click', function () {
        window.location.href = 'index.html';
      });
    }
  })();

})();