//Plagin Galery(filter) + Pagination
var getrow = Math.ceil((document.body.clientWidth - (document.querySelector('#page .num').scrollWidth+10))/ (document.querySelector('#page .num').scrollWidth+10));
var Pagination = {
    pgainator: document.querySelector('#pagination'),
    code: '',
    filter: [], 
    cnt: getrow*2, //количество элементов на странице (2 - количество строк)
    rowItems: getrow,  //количество элементов в строке
    pageGalery: document.querySelector('#page'),
    items: document.querySelectorAll('#page .num'),
    width: document.querySelector('#page .num').scrollWidth+10,
    height: document.querySelector('#page .num').scrollHeight+10,
    goStep: 0,
    // --------------------
    // Utility
    // --------------------
    // converting initialize data
    Extend: function(data) {
        data = data || {};
        Pagination.size = data.size || 300;
        Pagination.page = data.page || 1;
        Pagination.step = data.step || 3;
    },
    // add pages by number (from [s] to [f])
    Add: function(s, f) {
        for (var i = s; i < f; i++) {
            Pagination.code += '<a>' + i + '</a>';
        }
    },
    // add last page with separator
    Last: function() {
        Pagination.code += '<i>...</i><a>' + Pagination.size + '</a>';
    },
    // add first page with separator
    First: function() {
        Pagination.code += '<a>1</a><i>...</i>';
    },
    // --------------------
    // Handlers
    // --------------------
    // change page
    Click: function() {
        Pagination.page = +this.innerHTML;
        Pagination.goStep = Pagination.page*Pagination.cnt-Pagination.cnt;
        Pagination.Start();
        if(Pagination.page=='1') Pagination.prev.classList.add('disabled');   
        else Pagination.prev.classList.remove('disabled');
    },
    // previous page
    Prev: function() {
        Pagination.page--;
        if (Pagination.page < 1) {
            Pagination.page = 1;
        }
        Pagination.goStep = Pagination.goStep - Pagination.cnt;
        Pagination.Start();
        if(Pagination.page == Pagination.size) Pagination.next.classList.add('disabled');   
        else Pagination.next.classList.remove('disabled');
    },
    // next page
    Next: function() {
        Pagination.page++;
        if (Pagination.page > Pagination.size) {
            Pagination.page = Pagination.size;
        }
        Pagination.goStep = Pagination.goStep + Pagination.cnt;
        Pagination.Start();
        if(Pagination.page == Pagination.size) Pagination.next.classList.add('disabled');   
        else Pagination.next.classList.remove('disabled');
    },
    // --------------------
    // Script
    // --------------------    
    SetResize: function(){        
        Pagination.rowItems = Math.ceil((document.body.clientWidth - (document.querySelector('#page .num').scrollWidth+10))/ (document.querySelector('#page .num').scrollWidth+10));
        Pagination.cnt = Pagination.rowItems*2;        
        Pagination.goStep = 0;
        Pagination.page = 1;
        Pagination.size = Math.ceil(Pagination.filter.length / Pagination.cnt);
        Pagination.pgainator.style.marginLeft = Math.ceil((document.body.clientWidth-Pagination.pgainator.scrollWidth)/2)+'px';
        Pagination.Start();
    },    
    //пропишим дату для фильтра
    SetDataNum: function(filt) {
        for (var i = 0; i < filt.length; i++) {
            filt[i].dataset.num = i+1;
        }
    },
    //загрузка итемов
    LoadItems: function(filt, data_page) {
        var j = 0;      
        for (var i = 0; i < filt.length; i++) {
            var data_num = filt[i].dataset.num;
            if (data_num <= data_page || data_num >= data_page) Pagination.AnimHide(filt[i]);
        }
        for (var i = data_page; i < filt.length; i++) {
            if (j >= Pagination.cnt) break;
            Pagination.AnimShow(filt[i],i);       
            j++;
        }
    },
    //Анимация появления итемов
    AnimShow: function(elem, z){         
        var rt = 0;
        elem.style.opacity = "1";                
        while(z>=Pagination.rowItems) {
            z=z-Pagination.rowItems;
            rt++;
        }  
        while(rt>=Pagination.cnt / Pagination.rowItems) {
            rt=rt-Pagination.cnt / Pagination.rowItems;
        }        
        elem.style.transform = 'translate('+(z*Pagination.width-elem.offsetLeft)+'px, '+(rt*Pagination.height-elem.offsetTop)+'px)';
        Pagination.pageGalery.style.width = Pagination.rowItems*Pagination.width+'px';
        Pagination.pageGalery.style.height =  Math.ceil(Pagination.cnt / Pagination.rowItems)*Pagination.height+'px';
    },
     //Анимация исчезания итемов
    AnimHide: function(elem){
        elem.style.opacity = "0";
        elem.style.transform = 'initial'; 
    },
    //клик по выбору фильтра
    ClickBtnFilter: function(){
        var k=0; 
        for(var i=0;i<document.querySelectorAll('#filter a').length;i++){
            document.querySelectorAll('#filter a')[i].className = '';
        }
        this.classList.add('active');
        var filterGet = [];        
        for(i=0;i<Pagination.items.length;i++){        
            if(Pagination.items[i].dataset.groups.indexOf(this.dataset.group)>=0){            
               filterGet[k] = Pagination.items[i];           
               k++;           
            }
            else {
                Pagination.items[i].dataset.num = '';
                Pagination.AnimHide(Pagination.items[i]);
            }
        } 
        Pagination.filter = filterGet; 
        Pagination.SetDataNum(Pagination.filter);
        Pagination.goStep = 0;
        Pagination.page = 1;
        Pagination.size = Math.ceil(Pagination.filter.length / Pagination.cnt);        
        Pagination.Start(); 
    },
    // binding pages
    Bind: function() {
        var a = Pagination.e.getElementsByTagName('a');
        for (var i = 0; i < a.length; i++) {
            if (+a[i].innerHTML === Pagination.page) a[i].className = 'current';
            a[i].addEventListener('click', Pagination.Click, false);
        }
    },
    // write pagination
    Finish: function() {
        Pagination.e.innerHTML = Pagination.code;
        Pagination.code = '';
        Pagination.Bind();
    },
    // find pagination type
    Start: function() {
        if (Pagination.size < Pagination.step * 2 + 6) {
            Pagination.Add(1, Pagination.size + 1);
        }
        else if (Pagination.page < Pagination.step * 2 + 1) {
            Pagination.Add(1, Pagination.step * 2 + 4);
            Pagination.Last();
        }
        else if (Pagination.page > Pagination.size - Pagination.step * 2) {
            Pagination.First();
            Pagination.Add(Pagination.size - Pagination.step * 2 - 2, Pagination.size + 1);
        }
        else {
            Pagination.First();
            Pagination.Add(Pagination.page - Pagination.step, Pagination.page + Pagination.step + 1);
            Pagination.Last();
        }
        Pagination.Finish();
        if(Pagination.page==1) Pagination.prev.classList.add('disabled');   
        else Pagination.prev.classList.remove('disabled'); 
        if(Pagination.page == Pagination.size) Pagination.next.classList.add('disabled');   
        else Pagination.next.classList.remove('disabled'); 
        if(Pagination.size==1) document.querySelector('#pagination').style.display = 'none';
        else document.querySelector('#pagination').style.display = 'inline-block';
        if(Pagination.filter == '') Pagination.filter = Pagination.items;
        window.onresize = Pagination.SetResize;
         Pagination.pgainator.style.marginLeft = Math.ceil((document.body.clientWidth-Pagination.pgainator.scrollWidth)/2)+'px';
        Pagination.SetDataNum(Pagination.filter);
        Pagination.LoadItems(Pagination.filter, Pagination.goStep);
    },
    // --------------------
    // Initialization
    // --------------------
    // binding buttons
    Buttons: function(e) {
        var nav = e.getElementsByTagName('a');
        nav[0].addEventListener('click', Pagination.Prev, false);
        nav[1].addEventListener('click', Pagination.Next, false);
    },
    // create skeleton
    Create: function(e) {
        var html = [
            '<a id="prev">&#9668;</a>', // previous button
            '<span></span>',  // pagination container
            '<a id="next">&#9658;</a>'  // next button
        ];        
        e.innerHTML = html.join('');
        Pagination.e = e.getElementsByTagName('span')[0];
        Pagination.Buttons(e);
        Pagination.next = document.querySelector('#next');
        Pagination.prev = document.querySelector('#prev');       
        //вешаем события на кнопки выбора фильтра
        for(var i=0;i<document.querySelectorAll('#filter a').length;i++){
            document.querySelectorAll('#filter a')[i].onclick = Pagination.ClickBtnFilter;
        }
    },
    // init
    Init: function(e, data) {
        Pagination.Extend(data);
        Pagination.Create(e);
        Pagination.Start();
    }
};
/* * * * * * * * * * * * * * * * *
* Initialization
* * * * * * * * * * * * * * * * */
var init = function() {
        Pagination.Init(document.getElementById('pagination'), {
        size: Math.ceil(Pagination.items.length / Pagination.cnt), //кол-во страниц
        page: 1,  // selected page
        step: 3   // pages before and after current 
    });
};
document.addEventListener('DOMContentLoaded', init, false);