//紅綠燈按鈕
var selectMatterTypeButton = document.querySelector(".matter-level");
//任務輸入input
var matterInput = document.querySelector(".matter-input");
var plusButton = document.querySelector(".fa-plus");
//清單資料
var list = document.querySelector(".list");
var todos = JSON.parse(localStorage.getItem("todoList")) || [];
var matterType = "necessary"; //任務難度預設為日常事項
var body = document.querySelector("body");
//任務難度排列按鈕
var listSortButton = document.querySelector(".list-button");
//紅綠燈選擇任務難度
selectMatterTypeButton.addEventListener("click", handleMatterTypeClick);
//加入任務
plusButton.addEventListener("click", addMatterClick);
matterInput.addEventListener("keydown", addMatterWithEnter);
//編輯任務
list.addEventListener("click", identifyMatterClick);
body.addEventListener("click", renderList);      //如果input資料沒編輯完(沒按enter)渲染先前的資料，此舉避免使用者有已更新成功的誤會
renderList();
//將任務用難度排列
listSortButton.addEventListener("click", sortMatterClick);
//選擇紅綠燈的任務類別
function handleMatterTypeClick(e) {
    let eTarget = e.target;
    let eTagName = eTarget.tagName;
    let eClassName = eTarget.className;
    if (eTagName === "INPUT") {
        matterType = eClassName;
    }
}
//加入任務透過+字符
function addMatterClick() {
    let inputContent = matterInput.value;
    if (inputContent) {
        let todo = {
            matter: matterInput.value,
            matterLight: matterType,
            matterFinished : false
        }
        switch (matterType) {  //order這個key是用來讓todos重新排列用的
            case "crucial":
                todo.order = "1";
                break;
            case "necessary":
                todo.order = "2";
                break;
            case "trivial":
                todo.order = "3";
                break;
            default:
                break;
        }
        todos.push(todo);
        renderList();
    }
    matterInput.value = "";
}
//按Enter加入任務
function addMatterWithEnter(e) {
    let enterAsciiCode = 13;
    if (e.which === enterAsciiCode) {
        addMatterClick();
    }
}
//完成、刪除、編輯任務
function identifyMatterClick(e) {
    e.stopPropagation();
    let eTarget = e.target;
    let eClassList = eTarget.classList;
    let eTagName = eTarget.tagName;
    let index = eTarget.parentNode.dataset.index;
    //按垃圾桶刪除任務
    if (eClassList.contains("delete")) {
        let listLi = document.querySelector(`.list li[data-index='${index}']`);
        listLi.classList.add("animation-delete");
        setTimeout(function () { //因為animation動畫要0.3秒的時間，所以延遲執行
            todos.splice(index, 1);
            renderList();
        }, 300);
    }
    //按方塊會出現勾勾，任務會被劃掉但不會從list消失
    else if (eClassList.contains("check")) {
        todos[index].matterFinished = !todos[index].matterFinished; //直接更改該物件的 boolean ，再存入 matterFinished
        let listSpan = document.querySelector(`.list li[data-index='${index}'] span`);
        let matterFinished = todos[index].matterFinished;
        //如果完成任務點擊方塊加入橫槓
        if(matterFinished){
            listSpan.classList.add("strikethrough");  
            eClassList.add("done");
        }else{
            listSpan.classList.remove("strikethrough");
            eClassList.remove("done");
        }
        renderList();
    }
    else if (eTagName == "SPAN") {  //點擊任務內容可以直接修改，要記得按Enter,不然部會更動
        eTarget.innerHTML = `<input type='text' class='list-item-content'>`;   //點擊任務內容先將span轉成input修改
        let listInput = document.querySelector(".list input"); //新出來的input要重抓
        listInput.addEventListener("keydown", editText); //在這個input加入修改function
        eClassList.remove("strikethrough");//修改已完成任務時先把橫槓移除
        listInput.value = todos[index].matter;
        listInput.focus();  //修改後從抓新出來的input後聚焦在上面
        function editText(e) {
            if (e.which == "13" && this.value !== "") { //當按enter且內容不能空白
                let editContent = listInput.value;
                todos[index].matter = editContent;
                renderList();
            }
        }
    }
    //如果input資料沒編輯完(沒按enter)渲染先前的資料，此舉避免使用者有已更新成功的誤會
    else {
        renderList();
    }
}

//渲染 list 畫面
function renderList() {
    let htmlContent = "";
    let temp = function(element,index){
        if(element.matterFinished){
            return `<li class="list-item list-item-${element.matterLight}" data-index='${index}'>
                    <span class="strikethrough">${element.matter}</span>
                    <i class="fas fa-trash delete float-right"></i>
                    <i class="fas fa-check check done float-right"></i>
                </li >`
        }else{
            return `<li class="list-item list-item-${element.matterLight}" data-index='${index}'>
                    <span>${element.matter}</span>
                    <i class="fas fa-trash delete float-right"></i>
                    <i class="fas fa-check check float-right"></i>
                </li >`
        }
    };
    htmlContent = todos.map(temp).join("");
    if (htmlContent) {
        list.innerHTML = htmlContent;
    } else {
        list.innerHTML = "<h1 class = 'text-center list-text'>找點事做吧!</h1>";
    }
    localStorage.setItem("todoList", JSON.stringify(todos));
}

//按照難度排任務順序
function sortMatterClick() {
    todos = todos.sort(function (a, b) {
        return a.order - b.order;  //利用資料的order重新排列todos陣列
    })
}