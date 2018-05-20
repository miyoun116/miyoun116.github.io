var product_list = null;
function load_product_list(cb) {
    $.getJSON("product_list.json")
    .done(function(data) {
        product_list = data.hanbok;
        cb();
    })
    .fail(function() {
        console.error("getJSON failed, status: " + textStatus + ", error: "+error)
    });
}

/* adopted from http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html */
function urlParam(name) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == name) {
            return sParameterName[1];
        }
    }
}