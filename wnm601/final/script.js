/* Miyoun Cho
   Assignment 14.1: Final Project 
   Java Scripts */

/* Manage Product List for Shop and Detail Page*/
var productList = null;
function loadProductList(cb) {
    $.getJSON("product_list.json")
    .done(function(data) {
        productList = data.hanbok;
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

/* Slider for story page */
function loadSlider() {
    var slide_selected = 0;
    var slide_imgs = $("#slider #slides img");
    var dir = 'right';
    function reverse(dir) {
        if (dir == 'left') 
            return 'right';
        else if (dir == 'right')
            return 'left';
        return null;
    }
    function show_slide() {
        while (slide_selected < 0 ) 
            slide_selected += slide_imgs.length;
        while (slide_selected >= slide_imgs.length)
            slide_selected -= slide_imgs.length;
        for (var i = 0; i < slide_imgs.length; i++) {
            if (i == slide_selected) {
                $(slide_imgs.get(i)).show("slide", {direction:dir}).fadeTo(0.5, 1);
            } else {
                $(slide_imgs.get(i)).fadeTo(0, 0.8).hide("slide", {direction:reverse(dir)});
            }
        }
    }
    $("#slider #lbutton").on("click", function() {
        slide_selected = (slide_selected - 1) % slide_imgs.length;
        dir = 'left';
        show_slide();
    });
    $("#slider #rbutton").on("click", function() {
        slide_selected = (slide_selected + 1) % slide_imgs.length;
        dir = 'right';
        show_slide();
    })
    show_slide();
}

/* Shop Page Product list */
function updateProducts() {
    var list_html = "";
    if (productList == null)
        return;
    var filter = urlParam('filter');
    for (var i = 0; i < productList.length; i++) {
        var color = productList[i].color;
        color = String(color).toLowerCase();
        if (filter != null && filter != color) {
            continue;
        }
        list_html += makeProductHTML(i);
    }
    $("#shop .hanbok_list").html(list_html);
}

/* Create List Item for a given id */
function makeProductHTML(id) {
    var name = productList[id].name;
    var img_file = productList[id].image[0];
    var price = productList[id].price;
    return `<li class = "product"> 
        <a href="?page=detail&product-id=`+id+`" class="img_link"> 
            <img itemprop="image" class=" product_image" 
            src="`+img_file+`" alt="`+name+`"  
            width="300px" height="400px" /> 
        </a> 
        <div class="product_info"> 
            <a href="?page=detail&product-id="`+id+`" class="product_title">`+name+`</a><br><br> 
            <p class="product_price">$`+price+`</p> 
        </div> 
    </li>`;
}

/* Filter support on Product List */
/* When the user clicks on the button, toggle between hiding and showing the dropdown content */
function onFilter() {
    document.getElementById("color_filter").classList.toggle("show");
}

/* Close the dropdown if the user clicks outside of it */
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

/* Product Detail Page */
/* load information about the selected product from the json */
function loadProductDetail() {
    id = urlParam('product-id');// || 0;
    if (productList != null && id >= 0 && id < productList.length) {
        var product = productList[id];
        $("#detail #detailbox #name").html(product.name);
        $("#detail #detailbox #price").html("$" + product.price);
        $("#detail #detailbox #color").html(product.color);
        $("#detail #detailbox #description").html(product.description);
        $("#detail #detailimage").attr("src", product.image[0]);
        magnify("detailimage", 3);
    } else {
        $("#detail #detailbox").html("<h1> Invalid product id:"+id+"</h1");
        $("#detail .imagebox").html("");
    }
}

// magnifier: adoped from https://www.w3schools.com/howto/howto_js_image_magnifier_glass.asp
// updated to show the maginifier only when mouse cursor is on the image.
function magnify(imgID, zoom) {
    var img, glass, w, h, bw;
    img = document.getElementById(imgID);
    if (img == null) {
        return;
    }
    /*create magnifier glass:*/
    glass = document.createElement("DIV");
    glass.setAttribute("class", "img-magnifier-glass");
    /*insert magnifier glass:*/
    img.parentElement.insertBefore(glass, img);
    /*set background properties for the magnifier glass:*/
    glass.style.backgroundImage = "url('" + img.src + "')";
    glass.style.backgroundRepeat = "no-repeat";
    /* make it not visible in the beginning */
    glass.style.backgroundSize = 0;//(img.width * zoom) + "px " + (img.height * zoom) + "px";
    glass.style.borderWidth = "0px";
    bw = 3;
    w = glass.offsetWidth / 2;
    h = glass.offsetHeight / 2;
    /*execute a function when someone moves the magnifier glass over the image:*/
    glass.addEventListener("mousemove", moveMagnifier);
    img.addEventListener("mousemove", moveMagnifier);
    /*and also for touch screens:*/
    glass.addEventListener("touchmove", moveMagnifier);
    img.addEventListener("touchmove", moveMagnifier);

    function moveMagnifier(e) {
        var pos, x, y;
        /*prevent any other actions that may occur when moving over the image*/
        e.preventDefault();
        /*get the cursor's x and y positions:*/
        pos = getCursorPos(e);
        x = pos.x;
        y = pos.y;
        /*prevent the magnifier glass from being positioned outside the image:*/
        if (x > img.width - (w / zoom) ||
            x < w / zoom ||
            y > img.height - (h / zoom) ||
            y < h / zoom ) {
            glass.style.backgroundSize = "0";
            glass.style.borderWidth = 0;
            return;
        }
        glass.style.borderWidth = bw + "px";
        glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
        /*set the position of the magnifier glass:*/
        glass.style.left = (x - w) + "px";
        glass.style.top = (y - h) + "px";
        /*display what the magnifier glass "sees":*/
        glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
    }

    function getCursorPos(e) {
        var a, x = 0, y = 0;
        e = e || window.event;

        /*get the x and y positions of the image:*/
        a = img.getBoundingClientRect();
        /*calculate the cursor's x and y coordinates, relative to the image:*/
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /*consider any page scrolling:*/
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return {x : x, y : y};
    }
}
