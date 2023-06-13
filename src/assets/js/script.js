
window.addEventListener('DOMContentLoaded', function () {
    menu();
    swiperSetting();
})

// ハンバーガーメニュー開閉
function menu() {
    $(".openbtn").click(function () {
        $(this).toggleClass('active');
        $(".hamburger").toggleClass('active');
    });
}

// swiper
function swiperSetting() {
    let _swiperBanner = document.querySelectorAll('.works__banner')
    if(!_swiperBanner) {return}
    const swiperBanner = new Swiper(".works__banner", {
        slidesPerView: "auto", // 一度に表示する枚数
        loop: true, // ループ有効
        speed: 6000, // ループの時間
        spaceBetween: 30,
        autoplay: {
            delay: 0,
        },
    });
}

window.addEventListener('DOMContentLoaded', () => {

    const breakPoint = 768;
    let swiperSp;
    if (window.innerWidth <= breakPoint) {
        swiperSp = new Swiper('.works__inner__right');
    } else {
        swiperSp = undefined;
    }
    window.addEventListener('resize', () => {
        if (window.innerWidth <= breakPoint) {
            if (swiperSp) return;
            swiperSp = new Swiper('.works__inner__right', {
                loop: true,
                // ページネーションが必要なら追加
                pagination: {
                    el: ".swiper-pagination"
                },
                // ナビボタンが必要なら追加
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                }
            });
        } else {
            if (!swiperSp) return;
            swiperSp.destroy();
            swiperSp = undefined;
        }
    }, false);
}, false);


// パララックス
var rellax = new Rellax('.rellax', {
    center: true,
});

// タブ
$(function(){
    $('.js-tab').click(function(){
      $('.tab').removeClass('is-active');
      $(this).addClass('is-active');
      $('.is-show').removeClass('is-show');
       
      const index = $(this).index();
      $('.tab-contents').eq(index).addClass('is-show');
    });
  });