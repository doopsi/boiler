
$(document).ready(function(){
    
    var setup_ultrashare = function(){
      $(".ultrashare .button").click(function(){
        $(this).parent().children(".popover").fadeIn();
      });
      $("article").mouseleave(function(){
        $(".ultrashare .popover").fadeOut();
      });
    }    

    var setup_posts = function(){
        $('article.video').fitVids({
            customSelector: 'iframe[src*="tumblr.com/video"]'
        });

        $('.photo.large .photo-img').each(function(){
            $(this).attr('src',$(this).data('highres'));
        });

        $('article.photoset .media').photosetGrid({
            gutter: '5px',
            rel: 'photoset-item',
            highresLinks: false,
            lowresWidth: 100,
            onComplete: function(){
                $('article.photoset .media').attr('style','');
                $('.post-container').isotope('reLayout');
                $('article.photoset .media').each(function(){
                    var photosetImages = $(this).find('img');
                    var photosetPackage = [];
                    for(i = 0; i < photosetImages.length; i++) {
                        photosetImages.eq(i).attr('data-count',i+1);
                    } 
                    $(this).find('img').each(function(){
                       var packagePart = {
                          width: $(this).data('width'),
                          height: $(this).data('height'),
                          low_res: $(this).attr('src'),
                          high_res: $(this).data('highres')
                       };
                       photosetPackage.push(packagePart);
                       $(this).on('click',function(){
                           Tumblr.Lightbox(photosetPackage,$(this).data('count'));
                       });
                    });
                });
            }
        });
            
        setup_ultrashare();
    } /* end setup_posts() function */ 

    $('.index-page .post-container').imagesLoaded(function(){
        $('.index-page .post-container').isotope({
            itemSelector: 'article',
            masonry: {
                columnWidth: 340
            }
        });
    });

    $('.hover-permalink').on('click',function(e){
        if( !$(e.target).is("path, .button") ) {
            e.preventDefault();
            window.location.href = $(this).find('a').attr('href');
        }
    });
    
    if(location.hostname.toString() !== "assets.txmblr.com"){
        function resize_handle(){
            if($('body').hasClass('index-page')){
                if($(window).width() <= 1024){ 
                    $('.photo-img').each(function(){
                        $(this).attr('src', $(this).data('highres'));
                    });

                    $('.post-container').imagesLoaded(function(){
                        $('.post-container').isotope('destroy');
                    });
                }else{
                    $('.post-container').imagesLoaded(function(){
                        $('.post-container').isotope({
                            itemSelector: 'article',
                            masonry: {
                                columnWidth: 340
                            }
                        });
                    });
                }
            }
        }
        
        resize_handle();
        $(window).on('resize',function(){
            resize_handle();
        });
    }

    if(Theme.hasInfiniteScroll){
        $('.index-page .post-container').infinitescroll({
            itemSelector: 'article',
            nextSelector: '#is-next',
            navSelector: '#is-nav',
            debug: false,
            extraScrollPx: 300,
            bufferPx: 300
        },function(elements, options){
            $(elements).css({ opacity: 0 });
            $('.post-container').imagesLoaded(function(){
                $('.post-container').isotope('appended',$(elements));
                $(elements).css({ opacity: 1 });
                setup_posts();
                setup_ultrashare();
                var postIds = [];
                var post = $(elements);
                $.each(post, function(){
                    postIds.push($(this).attr('id'));
                });
                Tumblr.LikeButton.get_status_by_post_ids(postIds);
            });
        });
    }

    setup_posts();
    setup_ultrashare();

    var firstIds = [];
    $.each( $('article'), function(){
        firstIds.push( $(this).attr('id') );
    } );
    Tumblr.LikeButton.get_status_by_post_ids( firstIds );

    $('.post-container').imagesLoaded(function(){
        $('.post-container').isotope('reLayout');
        $('#loader, #loaderbg').fadeOut(1000);
    });
});
