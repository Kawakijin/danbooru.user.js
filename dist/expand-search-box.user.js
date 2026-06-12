// ==UserScript==
// @name         Danbooru - Expand Search Box
// @author       hdk5
// @version      20260610172136
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/expand-search-box.user.js
// 
// @match        *://*.donmai.us/*
// @grant        none
// ==/UserScript==

/* globals
  Danbooru
  $
*/

setTimeout(() => {
  const $input = $('form#search-box-form input#tags');
  if ($input.length === 0) {
    return;
  }

  const $textarea = $('<textarea>', {
    'id': $input.attr('id'),
    'name': $input.attr('name'),
    'class': $input.attr('class'),
    'data-autocomplete': $input.attr('data-autocomplete'),
    'data-shortcut': $input.attr('data-shortcut'),
    'css': {
      resize: 'none',
      overflow: 'hidden',
      boxSizing: 'border-box',
    },
  });
  const textarea = $textarea.get(0);
  $textarea.val($input.val());

  $textarea.on('input', recalculateInputHeight);
  $textarea.on('keypress', (event) => {
    if (event.which !== 13 || event.shiftKey) {
      return;
    }
    event.preventDefault();
    $textarea.closest('form').trigger('submit');
  });

  $(window).on('resize', recalculateInputHeight);

  $input.replaceWith($textarea);
  recalculateInputHeight();

  // eslint-disable-next-line no-new
  new Danbooru.Autocomplete($textarea, 'tag_query');

  function recalculateInputHeight() {
    $textarea.css('height', 0);
    $textarea.css('height', `${textarea.scrollHeight}px`);
  }
}, 0);
