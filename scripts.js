/* performance logging helper */

function stamp(message) {
    console.log(new Date-performance.timing.navigationStart+":"+message);
}

stamp ('start');

function toClassName(name) {
    return (name.toLowerCase().replace(/[^0-9a-z]/gi, '-'))
}
  

function createTag(name, attrs) {
    const el = document.createElement(name);
    if (typeof attrs === 'object') {
      for (let [key, value] of Object.entries(attrs)) {
        el.setAttribute(key, value);
      }
    }
    return el;
  }  
  
function wrapSections(element) {
    document.querySelectorAll(element).forEach(($div) => {
        if (!$div.id) {
            const $wrapper=createTag('div', { class: 'section-wrapper'});
            $div.parentNode.appendChild($wrapper);
            $wrapper.appendChild($div);    
        }
    });
}

function decorateTables() {
    document.querySelectorAll('main div>table').forEach(($table) => {
      const $cols=$table.querySelectorAll('thead tr th');
      const cols=Array.from($cols).map((e) => toClassName(e.innerHTML)).filter(e => e?true:false);
      const $rows=$table.querySelectorAll('tbody tr');
      let $div={};
      
      $div=tableToDivs($table, cols) 
      $table.parentNode.replaceChild($div, $table);
    });
  }
    
function tableToDivs($table, cols) {
    const $rows=$table.querySelectorAll('tbody tr');
    const $cards=createTag('div', {class:`${cols.join('-')} block`})
    $rows.forEach(($tr) => {
      const $card=createTag('div')
      $tr.querySelectorAll('td').forEach(($td, i) => {
        const $div=createTag('div', cols.length>1?{class: cols[i]}:{});
          $div.innerHTML=$td.innerHTML;
          $div.childNodes.forEach(($child) => {
            if ($child.nodeName=='#text') {
              const $p=createTag('p');
              $p.innerHTML=$child.nodeValue;
              $child.parentElement.replaceChild($p, $child);
            }
          })
          $card.append($div);
        });
        $cards.append($card);
      });
    return ($cards);
  }  

function addDivClasses($element, selector, classes) {
    const $children=$element.querySelectorAll(selector);
    $children.forEach(($div, i) => {
        $div.classList.add(classes[i]);
    })
}

function decorateHeader() {
    const $header=document.querySelector('header');
    const classes=['logo', 'menu', 'susi'];
    addDivClasses($header, ':scope>div', classes);

    const $signup=$header.querySelector('a[href*="signup"');
    if ($signup) $signup.classList.add('button');
}

function decoratePictures() {
    if (!document.querySelector('picture')) {
        const helixImages=document.querySelectorAll('main>div:nth-of-type(n+2) img[src^="/hlx_"');
        helixImages.forEach($img => {
            const $pic=createTag('picture');
            const $parent=$img.parentNode;
            $pic.appendChild($img);
            $parent.appendChild($pic);
        })
    }
}

function decorateBlocks() {
    document.querySelectorAll('div.block').forEach(($block) => {
        const $section=$block.closest('.section-wrapper');
        if ($section) {
            const classes=Array.from($block.classList.values());
            $section.classList.add(classes[0]+'-container');
        }
    });
}

function readBlockConfig($block) {
  const config={};
  $block.querySelectorAll(':scope>div').forEach(($row) => {
    if ($row.children && $row.children[1]) {
      const name=toClassName($row.children[0].textContent);
      const $a=$row.children[1].querySelector('a');
      let value='';
      if ($a) value=$a.href;
      else value=$row.children[1].textContent;
      config[name]=value;  
    }
  });
  return config;
}


function decorateSheetForm() {
  const $block=document.querySelector('.sheet-form');
  if ($block) {
    const config=readBlockConfig($block);

    window.formConfig = {
      form_sheet: config['form-data-submission'],
      form_redirect: config['form-redirect']?config['form-redirect']:'thank-you',
      form_to_use: config['form-definition']
    }
    
    let tag = document.createElement("script");
    tag.src = "/scripts/create-form.js";
    document.getElementsByTagName("body")[0].appendChild(tag);
  
  }
}

function decorateCustomerSpotlight() {
    document.querySelectorAll('div.customer-spotlights').forEach(($block) => {
        const $rows=Array.from($block.children);
        const $nav=createTag('div', {class: 'spotlight-nav'});
        $rows.forEach(($row, i)=>{
            $row.classList.add('spotlight-row');
            addDivClasses($row, ':scope>div', ['logo', 'quote', 'name']);
            const $navButton=createTag('div', {class: 'spotlight-nav-button'});
            $nav.append($navButton);
            $navButton.addEventListener('click', (evt) => {
                $rows.forEach(($hideRow)=>{
                    $hideRow.classList.add('hidden');
                })
                $row.classList.remove('hidden');

                Array.from($nav.children).forEach(($deselectNavButton)=>{
                    $deselectNavButton.classList.remove('selected');
                })
                $navButton.classList.add('selected');
            })
            if (i) { 
                $row.classList.add('hidden');
            } else {
                $navButton.classList.add('selected');
            }
        })

    $block.append($nav);
    })
}

function decorateForms() {
    document.querySelectorAll('main div.form').forEach(($form) => {
        const $rows=Array.from($form.children);
        $rows.forEach(($row) => {
            const $cells=$row.children;
            const name=$cells[0].textContent.trim();
            const options=$cells[1].textContent.trim();
            const type=$cells[2].textContent.toLowerCase().trim();

            if (type=='text') {
                $row.innerHTML=`<label for="${name}">${name}</label><input name="${name}" type="${type}" placeholder="${options}"/>`;
            }
            if (type=='submit') {
                $row.innerHTML=`<button>${name}</button>`;
            }
        })
    });
}

function decorateColumns() {
    document.querySelectorAll('main > .section-wrapper').forEach(($section) => {
      if ($section.querySelector('div.video') || $section.querySelector('div.embed') || $section.querySelector(':scope > div > p > picture')) {
        const $columns=createTag('div', {class: 'columns'});
        const $children=Array.from($section.children[0].children);
        let $currentRow=createTag('div');
        let $blockCol=createTag('div');
        let $textCol=createTag('div');
        $currentRow.append($textCol);
        $currentRow.append($blockCol);
        $children.forEach(($child) => {
  
            if ($child.tagName=='DIV' && ($child.classList.contains('embed') || $child.classList.contains('block')) || 
              ($child.tagName=='P' && $child.querySelector(':scope>picture'))) {
            $blockCol.append($child);
            $columns.append($currentRow);
            $currentRow=createTag('div');
            $blockCol=createTag('div');
            $textCol=createTag('div');
            $currentRow.append($textCol);
            $currentRow.append($blockCol);
          } else {
            $textCol.append($child);
          }
        })
        
        $columns.append($currentRow);

        $section.firstChild.append($columns);
        $section.classList.add('columns-container');
      }
    })
  }
  
function playYouTubeVideo(vid, $element) {
  const ytPlayerScript='https://www.youtube.com/iframe_api';
  if (!document.querySelector(`script[src="${ytPlayerScript}"]`)) {
    const tag = document.createElement('script');
    tag.src = ytPlayerScript;
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  if (typeof YT !== 'undefined' && YT.Player) {
    const player = new YT.Player($element.id, {
      height: $element.clientHeight,
      width: $element.clientWidth,
      videoId: vid,
      events: {
          'onReady': (event) => {
            event.target.playVideo();
          },
        }
    });
  } else {
    setTimeout(() => {
      playYouTubeVideo(vid, $element);
    }, 100)
  }
}

function decorateVideos() {
    document.querySelectorAll('main .video').forEach(($video, i) => {
        const $a=$video.querySelector('a');
        const $play=createTag('div', { class: 'play'});
        $play.innerHTML='<div class="triangle"></div>';
        $video.append($play);
        $play.addEventListener('click',() => { 
          if ($a.href.indexOf('youtu')>0) {
            const yturl=new URL($a.href);
            let vid=yturl.searchParams.get('v');
            if (!vid) {
              vid=yturl.pathname.substr(1);
            }
            $video.id=`player-${i}`;
            playYouTubeVideo(vid, $video);
          }
        })
    })
}

/**
 * Loads a CSS file.
 * @param {string} href The path to the CSS file
 */
function loadCSS(href) {
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', href);
  link.onload = () => {
  }
  link.onerror = () => {
  }
  document.head.appendChild(link);
};


function decoratePage() {
    decoratePictures();
    decorateHeader();
    decorateTables();
    wrapSections('main>div');
    decorateBlocks();
    decorateColumns();
    decorateCustomerSpotlight();
    decorateForms();
    decorateVideos();
    decorateSheetForm();
    wrapSections('footer>div');
    loadCSS('/lazy-styles.css');
}

decoratePage();