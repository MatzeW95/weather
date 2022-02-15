document.getElementById("btnToday").addEventListener("click", function() {
    
    document.getElementById("tabToday").style.display = "block";
    document.getElementById("tabTomorrow").style.display = "none";
});

document.getElementById("btnTomorrow").addEventListener("click", function() {
    
    document.getElementById("tabToday").style.display = "none";
    document.getElementById("tabTomorrow").style.display = "block";
});