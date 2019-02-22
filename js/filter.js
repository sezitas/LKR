$(document).ready(function () {
  $('#license-search').on('keyup', function () {
    var value = $(this).val().toLowerCase()
    $('#license-table tbody tr').filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    })
  })
})
