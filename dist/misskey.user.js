// ==UserScript==
// @name        Misskey - Unblock Sensitive
// @author      hdk5
// @version     2
// @namespace   https://github.com/hdk5/danbooru.user.js
// @match       *://misskey.io/*
// @inject-into page
// ==/UserScript==

/* globals unsafeWindow */

function patch_sensitive(data) {
  if (Array.isArray(data)) {
    data.forEach(item => patch_sensitive(item))
  }
  else if (typeof data === 'object' && data !== null) {
    for (const key in data) {
      if (key === 'isSensitive' && data[key] === true) {
        data[key] = false
      }
      else {
        patch_sensitive(data[key])
      }
    }
  }
}

const _fetch = unsafeWindow.fetch
unsafeWindow.fetch = async function (...args) {
  const response = await _fetch.apply(this, args)
  const _json = response.json
  response.json = async function () {
    const json = await _json.call(this)
    patch_sensitive(json)
    return json
  }
  return response
}
