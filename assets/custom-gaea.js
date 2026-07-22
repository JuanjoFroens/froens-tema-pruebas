
$(function(){
  $('body').on('click', '[name="checkout"], [name="goto_pp"], [name="goto_gc"]', function() {
      if ($('#cart_agree').is(':checked')) {
        $(this).submit();
      }
      else {
        const warning = `<p class="warning">Usted debe estar de acuerdo con los términos y condiciones.</p>`;
        if ($('p.warning').length === 0) {
          $('.agree_terms').after(warning);
        }
        //alert("Usted debe estar de acuerdo con los términos y condiciones.");
        return false;
      }
    });

    $('.gaea.totalbruto .cart__footer__value').on('DOMSubtreeModified', function(){
      let totalBrutoNew = $('.gaea.totalbruto .cart__footer__value').html(); // $163,360 CLP
      let limpiamos = totalBrutoNew.replace(' CLP', '').replace('$', '').replace('.', '');
      totalBrutoNew = parseInt(limpiamos);
      if(totalBrutoNew) {
        var descuentoTotal=0;

        $('.cart__items .cart__items__row .cart__items__grid').each(function(){
                let cantidad = $(this).children('.cart__items__quantity').children('.quantity__wrapper').children('.quantity__input').val();
                let precioNormal = $(this).children('.cart__items__price').children('.line__price').children('del').html();
                let precioRebajado = $(this).children('.cart__items__price').children('.line__price').children('mark').html();
                
                if(precioNormal){
                  let limpiamosNormal = precioNormal.replace(' CLP', '').replace('$', '').replace('.', '');  // $19.990
                  precioNormal = parseInt(limpiamosNormal);
                }
                if(precioRebajado){
                  let limpiamosRebajado = precioRebajado.replace(' CLP', '').replace('$', '').replace('.', '');  // $19.990
                  precioRebajado = parseInt(limpiamosRebajado);
                }
                
                if(precioNormal && precioRebajado){
                  let diferencia = (precioNormal-precioRebajado) * cantidad;
                  descuentoTotal+=parseInt(diferencia);
                  let descuentoTotalFormato = new Intl.NumberFormat('es-CL', {currency: 'CLP', style: 'currency'}).format(descuentoTotal) + ' CLP';

                  let subTotalNew = totalBrutoNew + descuentoTotal;
                  let subTotalFormato = new Intl.NumberFormat('es-CL', {currency: 'CLP', style: 'currency'}).format(subTotalNew) + ' CLP';

                  $('.gaea.descuentos .cart__footer__value').html(descuentoTotalFormato);
                  $('.gaea.subtotal .cart__footer__value').html(subTotalFormato);
                }                
         });
      }
    });


  // Colores colecciones (en desuso?)
  /*
  $('.colores-wrap.colecciones .colores li').each(function(event){
    $(this).children("a").click(function(event){
      event.preventDefault();
      event.stopPropagation();
      
      let id = $( this ).parent().attr("data-id");
      let nombre = $( this ).parent().attr("data-name");
      let precioVenta = $( this ).parent().attr("data-price") /100;
      let precioVentaFormato = new Intl.NumberFormat('es-CL', {currency: 'CLP', style: 'currency'}).format(precioVenta);
      let precioOriginal = $( this ).parent().attr("data-compare_at_price") /100;
      let precioOriginalFormato = new Intl.NumberFormat('es-CL', {currency: 'CLP', style: 'currency'}).format(precioOriginal);
      let precioHtml='';
      let url = $( this ).attr("href");
      let tituloActual = $( this ).parent().parent().parent().parent().find("a").attr("href");
      
      // nuevo enlace en el titulo
      $( this ).parent().parent().parent().parent().children("a").attr("href",url);
      $( this ).parent().parent().parent().parent().children("a").find("p").text(nombre);

      // cambio de precio
      $( this ).parent().parent().parent().parent().children("a").find(".product__grid__price").empty();
      if(precioOriginal!=''){
        precioHtml=`
        <span class="price on-sale">${precioVentaFormato}</span>
        <span class="compare-at">${precioOriginalFormato}</span>
        `;
      }
      else {
        precioHtml=`
        <span class="price">${precioVentaFormato}</span>
        `;
      }
      $( this ).parent().parent().parent().parent().children("a").find(".product__grid__price").append(precioHtml);

      // cambio imagen
      $( this ).parent().parent().parent().parent().parent().children("product-grid-item-variant").each(function(){
        let attrId=$( this ).attr("data-grid-item");
        
        if(id==attrId) $( this ).removeAttr( "hidden" );
        else $( this ).attr( "hidden","hidden" );        
      });      
    });        
  });
  */
});

// Search popdown manual trigger para Pipeline 8
window.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(e) {
    const trigger = e.target.closest('[data-popdown-toggle="search-popdown"]');
    if (trigger) {
      // En mobile redirigir a /search, en desktop abrir popup
      if (window.innerWidth < 768) {
        return; // dejar comportamiento nativo (href="/search")
      }
      e.preventDefault();
      const inner = document.querySelector('#search-popdown');
      if (inner) {
        inner.classList.toggle('is-visible');
        const underlay = inner.closest('[data-search-popdown-wrap]')?.querySelector('[data-search-underlay]');
        if (underlay) underlay.classList.toggle('underlay--visible');
        const input = inner.querySelector('[data-predictive-search-input]');
        if (input) setTimeout(() => input.focus(), 100);
      }
    }

    // Cerrar con botón X
    const closeBtn = e.target.closest('[data-close-popdown]');
    if (closeBtn) {
      const inner = document.querySelector('#search-popdown');
      if (inner) {
        inner.classList.remove('is-visible');
        const underlay = inner.closest('[data-search-popdown-wrap]')?.querySelector('[data-search-underlay]');
        if (underlay) underlay.classList.remove('underlay--visible');
      }
    }
  });
});

// Forzar disponibilidad en existencia en colecciones
document.addEventListener('DOMContentLoaded', function() {
  if (!window.jQuery) return;

  jQuery(function($) {
    if (window.gaea && window.gaea.isCollection) {
      $("label[for='filter-Disponibilidad-1']").css("pointer-events", "none");
      $("label[for='filter-Disponibilidad-2']").css("pointer-events", "none");
    }

    // Links menú desktop → agregar filtro disponibilidad
    $(".header__menu .navlink").each(function() {
      let url = $(this).attr('href');
      if (!url) return;
      url = url.replace('https://froens.cl', '');
      let base = url.split('/')[1];
      if (base !== 'collections') return;
      if (url.indexOf('filter.v.availability') === -1) {
        $(this).attr('href', url + '?filter.v.availability=1');
      }
    });

    // Links menú mobile → agregar filtro disponibilidad
    $(".sliderow__title").each(function() {
      let url = $(this).attr('href');
      if (!url) return;
      url = url.replace('https://froens.cl', '');
      let base = url.split('/')[1];
      if (base !== 'collections') return;
      if (url.indexOf('filter.v.availability') === -1) {
        $(this).attr('href', url + '?filter.v.availability=1');
      }
    });

    $(".collection__active__filters .active__filters__clear").each(function() {
      let href = $(this).attr('href');
      if (href && href.indexOf('filter.v.availability') === -1) {
        $(this).attr('href', href + '&filter.v.availability=1');
      }
    });

// Observar cambios en filtros activos para ocultar "En existencia" dinámicamente
function ocultarBadgeExistencia() {
  $(".collection__active__filters .active__filters__remove").each(function() {
    let href = $(this).attr('href');
    let textoLimpio = $(this).clone().children().remove().end().text().trim();

    if (textoLimpio === 'En existencia') {
      $(this).hide();
    } else if (href && href.indexOf('filter.v.availability') === -1) {
      $(this).attr('href', href + '&filter.v.availability=1');
    }
  });
}

// Ejecutar al cargar
ocultarBadgeExistencia();

// Ejecutar cada vez que Pipeline actualiza los filtros via AJAX
const filtrosWrapper = document.querySelector('.collection__active__filters');
if (filtrosWrapper) {
  const observer = new MutationObserver(function() {
    ocultarBadgeExistencia();
  });
  observer.observe(filtrosWrapper, { childList: true, subtree: true });
}
  });
});