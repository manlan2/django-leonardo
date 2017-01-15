// In a perfect world, this would be its own library file that got included
// on the page and only the ``$(document).ready(...)`` below would be present.
// But this is an example.
var Autocomplete = function(options) {
  this.form_selector = options.form_selector
  this.url = options.url,
  this.delay = parseInt(options.delay || 300)
  this.minimum_length = parseInt(options.minimum_length || 3)
  this.form_elem = null
  this.query_box = null
}

Autocomplete.prototype.setup = function() {
  var self = this

  this.form_elem = $(this.form_selector)
  this.query_box = this.form_elem.find('input[name=q]')

  // Watch the input box.
  this.query_box.on('keyup', function() {
    var query = self.query_box.val()

    if(query.length < self.minimum_length) {
      return false
    }

    self.fetch(query)
  })

  // On selecting a result, populate the search field.
  /*this.form_elem.on('click', '.ac-result', function(ev) {
    self.query_box.val($(this).text())
    $('.ac-results').remove()
    self.form_elem.submit();
    return false
  })*/
}

Autocomplete.prototype.fetch = function(query) {
  var self = this

  $.ajax({
    url: this.url
  , data: {
      'q': query
    }
  , success: function(data) {
      self.show_results(data)

      $(".ac-results").css({
          'top': $(self.form_selector).offset().top + 40,
          'width': $(self.form_selector).width()
      });
    }
  })
}

Autocomplete.prototype.show_results = function(data) {
  // Remove any existing results.
  $('.ac-results').remove()

  var results = data.results || []
  var results_wrapper = $('<div class="ac-results"></div>')
  var base_elem = $('<div class="result-wrapper"><a href="#" class="ac-result"></a></div>')

  if(results.length > 0) {
    for(var res_offset in results) {
      var elem = base_elem.clone();
      // Don't use .html(...) here, as you open yourself to XSS.
      // Really, you should use some form of templating.
      elem.find('.ac-result').attr("href", results[res_offset]['url']);
      elem.find('.ac-result').text(results[res_offset]['title']);
      results_wrapper.append(elem);
    }
  }
  else {
    var elem = base_elem.clone()
    elem.text(gettext("No results found."))
    results_wrapper.append(elem)
  }

  this.query_box.after(results_wrapper)
}