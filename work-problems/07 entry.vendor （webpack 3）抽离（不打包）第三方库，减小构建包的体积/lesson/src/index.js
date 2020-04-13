import _ from 'lodash'
import Vue from 'vue'
import $ from 'jquery'

const dom = $('<div>')
dom.html(_.join(['hello','world','bye'], ' --- '));
$('body').append(dom);

console.info(Vue)
