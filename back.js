function go_back(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    window.location.href = urlParams.get('back') === null ? './index.html?anim=false' : './'.concat(urlParams.get('back'));
}