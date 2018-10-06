// ==UserScript==
// @name         Hacker News Dark Mode
// @version      0.1
// @description  Injects custom CSS into hackernews.com to make it more of a dark mode
// @author       Luke Fairchild
// @include      https://thehackernews.com/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function() {
	'use strict'

	const Cache = {}
	const CSS = {}

	Cache.get = function () {

		return GM_getValue('Hacker.News.Dark.Mode.Styles', {})
	}

	Cache.set = function (css) {
		GM_setValue('Hacker.News.Dark.Mode.Styles', {
			'css'       : css,
			'timestamp' : new Date().getTime()
		})
	}

	CSS.set = function (css) {

		if (typeof GM_addStyle != 'undefined') {
			GM_addStyle(css)

		} else if (typeof PRO_addStyle != 'undefined') {
			PRO_addStyle(css)

		} else if (typeof addStyle != 'undefined') {
			addStyle(css)

		} else {
			const element = document.createElement('style')
			const heads   = document.getElementsByTagName('head')

			element.type = 'text/css'
			element.appendChild(document.createTextNode(css))

			if (heads.length > 0) {
				heads[0].appendChild(element)

			// no head yet, stick it whereever
			} else {
				document.documentElement.appendChild(element)
			}
		}
	}

	CSS.get = function (callback) {
		if (typeof callback !== 'function') {
			throw new Error()
		}
		GM_xmlhttpRequest ({
			method : 'GET',
			url    : 'https://raw.githubusercontent.com/lukecfairchild/Hacker-News-Dark-Mode/master/src/Styles.css',
			onload : function (responseDetails) {

				callback(responseDetails.responseText)
			}
		})
	}

	const cache = Cache.get()

	if (cache.css) {
		CSS.set(cache.css)

		if (cache.timestamp + (1000 * 60 * 10) < new Date().getTime()) {
			CSS.get(function (css) {
				Cache.set(css)

				if (cache.css !== css) {
					CSS.set(css)
				}
			})
		}

	} else {
		CSS.get(function (css) {
			Cache.set(css)
			CSS.set(css)
		})
	}
})()
