var formSubmitted = false;
function isValid(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}


 function isNumberValid(number) {
			// var re = /^(\(?(0|\+44)[1-9]{1}\d{1,4}?\)?\s?\d{3,4}\s?\d{3,4})$/;
				var re = /^[0-9]+$/;
                return re.test(number);
            }	


     function isNameValid(name) {
            return name.trim() !== "";
        }


// get all data in form and return object
function getFormData() {
    var form = document.getElementById("myForm");
    var elements = form.elements; // all form elements
    var fields = Object.keys(elements).map(function(k) {
        if (elements[k].name !== undefined) {
            return elements[k].name;
            // special case for Edge's html collection
        } else if (elements[k].length > 0) {
            return elements[k].item(0).name;
        }
    }).filter(function(item, pos, self) {
        return self.indexOf(item) == pos && item;
    });
    var data = {};
    fields.forEach(function(k) {
        data[k] = elements[k].value;
        var str = ""; // declare empty string outside of loop to allow
        // it to be appended to for each item in the loop
        if (elements[k].type === "checkbox") { // special case for Edge's html collection
            str = str + elements[k].checked + ", "; // take the string and append
            // the current checked value to
            // the end of it, along with
            // a comma and a space
            data[k] = str.slice(0, -2); // remove the last comma and space
            // from the  string to make the output
            // prettier in the spreadsheet
        } else if (elements[k].length) {
            for (var i = 0; i < elements[k].length; i++) {
                if (elements[k].item(i).checked) {
                    str = str + elements[k].item(i).value + ", "; // same as above
                    data[k] = str.slice(0, -2);
                }
            }
        }
    });
    // add form-specific values into the data
    data.formDataNameOrder = JSON.stringify(fields);
    data.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
    data.formGoogleSendEmail = form.dataset.email || ""; // no email by default
    console.log(data);
    return data;
}


function handleFormSubmit(event) {
    event.preventDefault();
    var data = getFormData();
    var hasError = false;
  
    if (!isNameValid(data["full name"])) {
	    $("#imgNameErr").show();
	    //$("#fullname").css("border-color", "#d62c0b");
	    hasError= true;
    }

if (!isNumberValid(data.number)) {
    $("#imgNumber").show();
   // $("#number").css("border-color", "#d62c0b");
    hasError = true;
  }    
    
   if (!isValid(data.email)) {
	$("#imgEmail").show();
	//$("#email").css("border-color", "#d62c0b");
        hasError= true;
   }

    
    if(hasError === true){
        return false;
    }
    
      if(formSubmitted != true){
        formSubmitted = true;
        var btn = document.getElementById("submitbtn");
        btn.innerHTML = "<i class='fa fa-paper-plane'></i>&nbsp;Sending...";     
        //document.getElementById('email-invalid').style.display = 'none';
        $("#email-invalid").hide();
        var url = event.target.action;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log(xhr.status, xhr.statusText)
                console.log(xhr.responseText);	
                //window.location.href = "http://edyson.acnshop.eu/default.asp?CO_LA=GB_en";		
                window.location.replace("http://edyson.acnshop.eu");
            }
            return;
        };
        // url encode form data for sending as post data	  
        var encoded = Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
        }).join('&')

        xhr.send(encoded);
        }
        //return true;    
}

function loaded() {
   
    console.log('contact form submission handler loaded successfully');
		//clear old values
			$("#fullname").val("");
			$("#number").val("");
			$("#message").val("");
			$("#email").val("");
    // bind to the submit event of our form
    var form = document.getElementById('myForm');
    form.addEventListener("submit", handleFormSubmit, false);
};
document.addEventListener('DOMContentLoaded', loaded, false);

