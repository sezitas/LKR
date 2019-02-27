window.$ = window.jQuery = require('jquery')
// window.Tether = require('popper.js')
// window.Bootstrap = require('bootstrap')

$(document).ready(function () {
  $('#license-search').on('keyup', function () {
    var value = $(this).val().toLowerCase()
    $('#license-tbody tr').filter(function () {
      console.log($(this).text().toLowerCase().indexOf(value) > -1)
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    })
  })
})
