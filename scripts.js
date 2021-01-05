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
        console.log ($block);
        const $section=$block.closest('.section-wrapper');
        if ($section) {
            const classes=Array.from($block.classList.values());
            $section.classList.add(classes[0]+'-container');
        }
    });
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
            console.log($row);
        })

    $block.append($nav);
    })

}

function decoratePage() {
    decoratePictures();
    decorateHeader();
    decorateTables();
    wrapSections('main>div');
    decorateBlocks();
    decorateCustomerSpotlight();
}

decoratePage();