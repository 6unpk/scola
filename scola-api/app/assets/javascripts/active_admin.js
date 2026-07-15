//= require active_admin/base

// ─── Toast UI 마크다운 에디터 (게시글 본문) ────────────────────────────────
// #post_body textarea를 마크다운 WYSIWYG 에디터로 대체. 이미지는 /admin/uploads → R2.
(function () {
  function initEditor() {
    var ta = document.getElementById('post_body');
    if (!ta || ta.dataset.tuiInit || !(window.toastui && window.toastui.Editor)) return;
    ta.dataset.tuiInit = '1';
    ta.style.display = 'none';

    var holder = document.createElement('div');
    holder.style.marginBottom = '12px';
    ta.parentNode.insertBefore(holder, ta);

    var csrfEl = document.querySelector('meta[name="csrf-token"]');
    var csrf = csrfEl ? csrfEl.getAttribute('content') : null;

    var editor = new toastui.Editor({
      el: holder,
      height: '620px',
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      initialValue: ta.value || '',
      usageStatistics: false,
      hooks: {
        addImageBlobHook: function (blob, callback) {
          var fd = new FormData();
          fd.append('file', blob);
          fetch('/admin/uploads', {
            method: 'POST',
            headers: csrf ? { 'X-CSRF-Token': csrf } : {},
            body: fd,
            credentials: 'same-origin'
          })
            .then(function (r) { return r.json(); })
            .then(function (d) {
              if (d && d.url) callback(d.url, '');
              else alert('이미지 업로드 실패: ' + ((d && d.error) || ''));
            })
            .catch(function () { alert('이미지 업로드 실패'); });
        }
      }
    });

    editor.on('change', function () { ta.value = editor.getMarkdown(); });
    var form = ta.closest('form');
    if (form) form.addEventListener('submit', function () { ta.value = editor.getMarkdown(); });
  }

  function loadAssets(cb) {
    if (window.toastui && window.toastui.Editor) { cb(); return; }
    if (!document.getElementById('tui-editor-css')) {
      var link = document.createElement('link');
      link.id = 'tui-editor-css';
      link.rel = 'stylesheet';
      link.href = '/vendor/toastui-editor.min.css';
      document.head.appendChild(link);
    }
    var s = document.createElement('script');
    s.src = '/vendor/toastui-editor-all.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('post_body')) return;
    loadAssets(initEditor);
  });
})();
