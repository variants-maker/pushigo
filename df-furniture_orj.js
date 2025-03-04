$(document).ready(function() {

	if($(".custom-row").length && $("#shortdetails").length > 0 && productIsVariant == 0) {
		
		$("#furniture-tab").removeClass("d-none");
		$("#furniture-container").removeClass("d-none");

		$(".add-to-cart-button").on("click", function(event) {
			
			event.preventDefault();
			event.stopImmediatePropagation();
		
			var url = "/quickOrder?";
            var counter = 0;
			
			$(".custom-product").each(function() {
				  
				if($(this).is(":visible")) {
					
					url += '&products['+counter+'][id]=' + $(this).attr("data-id") + '&products['+counter+'][amount]=' + $(this).find(".custom-quantity").text();
					counter++;
					
				}
			  
			});

			$("a[data-selector=add-to-cart]").attr("disabled", true);											   
										
			$.ajax({
				type: "GET",
				url: url,
				success: function(html) {

					$("a[data-selector=add-to-cart]").attr("disabled", false);
					
					window.location.href = '/sepet';
					
				}
			});
		
		});
		
		var quantities = $("#shortdetails").text().trim().split("|");
		
		$(".custom-product:visible").each(function(index) {
			
			$(this).find(".custom-quantity").text(quantities[index]);
			if(quantities[index] == 0) {
				$(this).addClass("d-none");
			}
			
		});
		
		createContainerContent();
		$("#totalp").text(number_format(totalSum(),2,",",".") + " TL");
		
		$(".furniture-change").on("click", function() {
		
			$("#furniture-tab:visible").trigger("click");
			$("html, body").animate({ scrollTop: $('#furniture-container').offset().top - 100 }, 500);
		
		});
		
		$(".custom-row2 input").on("keyup", function() {
			
			if($(this).val() == "" || $(this).val() == 0) {
				$(this).val(1);
			}
			
			updatePrice($(this));
			
		});
		
		$(document).on("click", ".minus", function() {
			
			if($(this).parents(".custom-row2").find("input").val() > 1) {
				
				$(this).parents(".custom-row2").find("input").val(parseInt($(this).parents(".custom-row2").find("input").val()) - 1);
				updatePrice($(this).parents(".custom-row2").find(".input-number"));
			
			}
			else {
				$(this).parents(".custom-row2").find(".removeFurniture").trigger("click");
			}
			
		});
		
		$(document).on("click", ".plus", function() {
	
			$(this).parents(".custom-row2").find(".input-number").val(parseInt($(this).parents(".custom-row2").find(".input-number").val()) + 1);
			
			updatePrice($(this).parents(".custom-row2").find(".input-number"));
			
		});
		
		$(".input-number").mask("00");
		
		$(document).on("click", ".removeFurniture", function() {
			
			if($(".removeFurniture").length > 1) {
			
				$(this).text("+");
				$(this).removeClass("removeFurniture").addClass("addFurniture");
				$(this).parents(".custom-row2").find(".orange").removeClass("d-none");
				$(this).parents(".custom-row2").find(".input-number,.input-group-btn").addClass("d-none").removeClass("d-lg-block");
				
				var dataid = $(this).parents(".custom-row2").attr("data-id");
				
				$(".custom-product[data-id=" + dataid + "]").hide();

				console.log("test");
				
				updatePrice($(this).parents(".custom-row2").find(".input-number"), 0);
				
			}
			
		});
		
		$(document).on("click", ".addFurniture", function() {
			
			$(this).text("-");
			$(this).removeClass("addFurniture").addClass("removeFurniture");
			$(this).parents(".custom-row2").find(".orange").addClass("d-none");
			$(this).parents(".custom-row2").find(".input-number,.input-group-btn").removeClass("d-none");
			$(this).parents(".custom-row2").find(".input-group-btn").addClass("d-lg-block");
			
			var dataid = $(this).parents(".custom-row2").attr("data-id");
				
			$(".custom-product[data-id=" + dataid + "]").show();
			
			updatePrice($(this).parents(".custom-row2").find(".input-number"));
			
		});
		
		$(document).on("click", ".custom-row2 .orange", function() {
			
			$(this).parents(".custom-row2").find(".addFurniture").trigger("click");
			
		});
									
	}
	
});

function updatePrice(elem, q = -1) {
	var quantity = q == 0 ? 0 : parseInt(elem.val());
	var price = elem.parents(".custom-row2").find(".single-price").text().replace(".","").replace(",",".");
	var tprice = number_format(parseFloat(price) * (q == -1 ? parseInt(quantity) : 1),2,",",".");

	elem.parents(".custom-row2").find(".tprice").text(tprice);
	
	var dataid = elem.parents(".custom-row2").attr("data-id");

	$(".custom-product[data-id='" + dataid + "']").find(".custom-quantity").text(quantity);
	
	if(quantity == 0) {
		$(".custom-product[data-id='" + dataid + "']").addClass("d-none").removeClass("d-flex");
	}
	else {
		$(".custom-product[data-id='" + dataid + "']").removeClass("d-none").addClass("d-flex");
	}
	
	if($(".product-price-new").length) {
		$("#totalp").text(number_format(totalSum(),2,",",".") + " TL");
		$(".product-price-new").text(number_format(totalSum(),2,",",".") + " TL");
		$(".product-price-old").text(number_format(totalSum2(),2,",",".") + " TL");
		
		$(".discount-label b").text("%" + number_format(100 - (totalSum() / totalSum2() * 100),0,"",""));
		
	}
	else {
		$("#totalp").text(number_format(totalSum(),2,",",".") + " TL");
		$(".product-price-old").text(number_format(totalSum(),2,",",".") + " TL");	
	}
	
}

function createContainerContent() {
	
	$("#furniture-container").html('<div class="row custom-row2 heading"><div class="col-md-3 col-3">ParÃ§alar</div><div class="col-md-2 col-2 text-center">ÃœrÃ¼n FiyatÄ±</div><div class="col-md-3 col-3 text-center">Adet</div><div class="col-md-2 text-center col-2">Toplam Fiyat</div><div class="col-2"></div>');
	
	$(".custom-product").each(function(index) {
		
			if($(this).find('.custom-quantity').text() != '') {
			
			var price = $(this).find('.custom-price').text().replace(".","").replace(",",".");
			var quantity = $(this).find('.custom-quantity').text();
			var ptotal = number_format(parseFloat(price) * parseInt(quantity),2,",",".");
			var dataid = $(this).attr("data-id");
			
			if(quantity == 0) {
				$("#furniture-container").append('<div class="row custom-row2" data-id="' + dataid + '"><div class="col-md-3 col-3 align-items-center justify-left">' + $(this).find('div:eq(0)').text() + '</div><div class="col-md-2 col-2 text-center align-items-center""><span class="single-price">' + $(this).find('.custom-price').text() + '</span> TL</div><div class="col-md-3 col-3 text-center align-items-center""><div class="input-group">'+
			  '<span class="input-group-btn minus d-none">'+
				  '<span class="remove">-</span>'+
			  '</span>'+
			  '<span class="orange">TakÄ±ma ekle</span><input style="height: 35px;" type="text" class="form-control input-number d-none" value="1" min="1">'+
			  '<span class="input-group-btn plus d-none">'+
				  '<span class="remove">+</span>'+
			  '</span>'+
		  '</div>'+
		  '</div><div class="col-md-2 col-2 text-center align-items-center""><span class="tprice">' + number_format(parseFloat(price),2,",",".") + '</span> TL</div><div class="col-md-2 col-2 text-center align-items-center"><span class="remove addFurniture">+</span></div></div>');
			}
			else {
				$("#furniture-container").append('<div class="row custom-row2" data-id="' + dataid + '"><div class="col-md-3 col-3 align-items-center justify-left">' + $(this).find('div:eq(0)').text() + '</div><div class="col-md-2 col-2 text-center align-items-center""><span class="single-price">' + $(this).find('.custom-price').text() + '</span> TL</div><div class="col-md-3 col-3 text-center align-items-center""><div class="input-group">'+
			  '<span class="input-group-btn minus">'+
				  '<span class="remove">-</span>'+
			  '</span>'+
			  '<span class="d-none orange">TakÄ±ma ekle</span><input style="height: 35px;" type="text" class="form-control input-number" value="' + $(this).find('.custom-quantity').text() + '" min="1">'+
			  '<span class="input-group-btn plus">'+
				  '<span class="remove">+</span>'+
			  '</span>'+
		  '</div>'+
		  '</div><div class="col-md-2 col-2 text-center align-items-center""><span class="tprice">' + ptotal + '</span> TL</div><div class="col-md-2 col-2 text-center align-items-center"><span class="remove removeFurniture">-</span></div></div>');
			}
			
		}
		
	});
	
	if($(window).width() < 1000) {
		
		$(".input-number").each(function() {
		
			$(this).attr("disabled", true);
		
		});
		
	}
	
}

function totalSum() {
	
	var sum = 0;
	
	$(".custom-product:visible").each(function(index) {
		
		if($(this).is(":visible")) {
				
			var price = parseFloat($(this).find(".custom-price").text().replace(".","").replace(",","."));
			var quantity = parseInt($(this).find(".custom-quantity").text());
			var total = parseFloat((price * quantity).toFixed(2));
			
			sum += total;
			
		}
		
	});
		
	return sum;
	
}

function totalSum2() {
	
	var sum = 0;
	
	$(".custom-product:visible").each(function(index) {
		
		if($(this).is(":visible")) {		
			var price = parseFloat($(this).find(".custom-price").attr("data-price").replace(".","").replace(",","."));
			var quantity = parseInt($(this).find(".custom-quantity").text());
			var total = parseFloat((price * quantity).toFixed(2));
			
			sum += total;
		}
		
	});
		
	return sum;
	
}

function number_format (number, decimals, dec_point, thousands_sep) {
    // Strip all characters but numerical ones.
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}
