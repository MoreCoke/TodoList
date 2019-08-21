//紅綠燈按鈕
var crucial = document.querySelector(".crucial");
var necessary = document.querySelector(".necessary");
var trivial = document.querySelector(".trivial");
//任務輸入input
var matterInput = document.querySelector(".matter-input");
var plus = document.querySelector(".fa-plus");
//清單資料
var list = document.querySelector(".list");
var data = JSON.parse(localStorage.getItem("todoList")) || [];
var type = "necessary"; //任務難度預設為日常事項
var body = document.querySelector("body");
//任務難度排列按鈕
var listButton = document.querySelector(".list-button");
//紅綠燈選擇任務難度
crucial.addEventListener("click", matterType);
necessary.addEventListener("click", matterType);
trivial.addEventListener("click", matterType);
//加入、刪除任務
plus.addEventListener("click", addMatter);
matterInput.addEventListener("keydown", addMatterEnter);
list.addEventListener("click", checkMatter);
body.addEventListener("click", updateList);
updateList();
//將任務用難度排列
listButton.addEventListener("click",arrangeMatter);
//選擇紅綠燈的任務類別
function matterType(e) {
    e.stopPropagation();
    type = e.target.className;
}
//加入任務透過+字符
function addMatter() {
    if (matterInput.value !== "") {
        var todo = {
            matter: matterInput.value,
            matterLight: type
        }
        switch(type){  //order這個key是用來讓data重新排列用的
            case "crucial":
                todo.order = "1";
                //console.log(todo);
                break;
            case "necessary":
                todo.order = "2";
                //console.log(todo);
                break;
            case "trivial":
                todo.order = "3";
                //onsole.log(todo);
                break;
            default:
                break;
        }
        data.push(todo);
        updateList();
    }
    matterInput.value = "";
}
//按Enter加入任務
function addMatterEnter(e) {
    if (e.which == "13") {
        addMatter();
    }
}
//delMatter、doneMatter、editmatter整理後的function
function checkMatter(e) {
    e.stopPropagation();
    var eClass = e.target.classList;
    var eNodeName = e.target.nodeName;
    if (eClass.contains("delete")) { //按垃圾桶刪除任務
        delMatter(e);
    }
    else if (eClass.contains("check")) { //按方塊會出現勾勾，任務會被劃掉但不會消失
        doneMatter(e);
    }
    else if (eNodeName == "SPAN") {  //點擊任務內容可以直接修改，要記得按Enter,不然部會更動
        editMatter(e);
    }
    else{
        updateList();
    }
}
//刪除任務
function delMatter(e) {
    e.stopPropagation();
    var index = e.target.dataset.nums;
    //var eClass = e.target.classList;
    var listLi = document.querySelectorAll(".list li");//新出來的LI要重抓
    // if (eClass.contains("delete")) {
    listLi[index].classList.add("animation-delete");
    setTimeout(function () { //因為animation動畫要0.3秒的時間，所以延遲執行
        data.splice(index, 1);
        updateList();
    }, 300);
    // }
}
//完成任務
function doneMatter(e) {
    e.stopPropagation();
    var listSpan = document.querySelectorAll(".list span");
    var index = e.target.dataset.nums;
    var eClass = e.target.classList;
    // if (eClass.contains("check")) {
    listSpan[index].classList.toggle("strikethrough");  //點擊方塊加入橫槓
    eClass.toggle("done");
    // }
}

//更改任務用
function editMatter(e) {
    e.stopPropagation();
    var listSpan = document.querySelectorAll(".list span");
    var index = e.target.dataset.nums;
    // if(e.target.nodeName =="SPAN"){
    listSpan[index].innerHTML = "<input type='text' class='list-item-content' data-nums=" + index + ">";   //點擊任務內容先將span轉成input修改
    var listInput = document.querySelector(".list input"); //新出來的input要重抓
    listSpan[index].classList.remove("strikethrough");//修改已完成任務時先把橫槓移除
    listInput.focus();  //修改後從抓新出來的input後聚焦在上面
    listInput.addEventListener("keydown", editText); //在這個input加入修改function
    // }
    function editText(e) {
        if (e.which == "13" && this.value !== "") { //當按enter且內容不能空白
            var edit = listInput.value;
            data[index].matter = edit;
            //console.log(this.value) //檢查this是不是抓對
            updateList();
        }
    }
}

//更新目前任務
function updateList() {
    str = "";
    for (var i = 0; i < data.length; i++) {
        str += '<li class="list-item-' + data[i].matterLight + '"><span data-nums=' + i + '>' + data[i].matter + '</span><div class="float-right"><i class="fas fa-check check" data-nums=' + i + '></i><i class="fas fa-trash delete" data-nums=' + i + '></i></div ></li >'
    }
    if (str != "") {
        list.innerHTML = str;
    } else {
        list.innerHTML = "<h1 class = 'text-center list-text'>找點事做吧!</h1>";
    }
    localStorage.setItem("todoList", JSON.stringify(data));
}

//按照難度排任務順序
function arrangeMatter(){
    data = data.sort(function(a,b) {
        return a.order-b.order;  //利用資料的order重新排列data陣列
    })
    // console.log(data);
    // console.log("end");
}