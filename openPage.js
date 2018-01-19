
function openPage(pageName,elmnt) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
		tablinks[i].style.borderBottomStyle = "none";

    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.backgroundColor = "#161616";
	elmnt.style.borderBottomStyle = "solid";
	elmnt.style.borderBottomColor = "rgb(65,186,174)";

	}
