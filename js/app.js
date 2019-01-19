//JAVASCRIPT MODULE PATTERN
!function() {
  /*
  STEP 1
  Get and display 12 random users from The Random User Generator API
  Using photos and information that the API provides, you’ll display 12 users, along with some basic information:
    Image
    First and Last Name
    Email
    City or location
  */
  //Get a reference to the UL element to append the list items to.
  const $employeeDirectoryUL = $('#employee-directory');

  //URL for the AJAX request.
  const randomUserURL = 'https://randomuser.me/api/';

  //The query string used in the AJAX request, asks for 12 users from the US only.
  const queryString = 'results=12&nat=us';

  //Take the data received by the randomuser API, add it to list items (formatted with appropriate <div> elements and class names for styling), and add the whole thing to the unordered list on the page.
  function displayUsers(data) {
    let employeeDirectoryHTML = '';
    $.each(data.results, function(i, randomUser) {
      employeeDirectoryHTML += `<li class="emp-card clearfix" id="emp-number-` + i + `">`;
      employeeDirectoryHTML += `<img class="profile-picture" src="` + randomUser.picture.large + `">`;
      employeeDirectoryHTML += `<div class="user-data">`;
      employeeDirectoryHTML += `<div class="user-name">` + randomUser.name.first + ` ` + randomUser.name.last + `</div>`;
      employeeDirectoryHTML += `<div class="user-email">` + randomUser.email + `</div>`;
      employeeDirectoryHTML += `<div class="user-location">` + randomUser.location.city + `</div>`;
      employeeDirectoryHTML += `</div><div class="additional-user-data">`;
      employeeDirectoryHTML += `<div class="user-cell">` + randomUser.cell + `</div>`;
      employeeDirectoryHTML += `<div class="user-username">` + randomUser.login.username + `</div>`;
      employeeDirectoryHTML += `<div class="user-address">` + randomUser.location.street + `, ` + randomUser.location.state + ` ` + randomUser.location.postcode + `</div>`;
      employeeDirectoryHTML += `<div class="user-birthday">Birthday: ` + randomUser.dob + `</div>`;
      employeeDirectoryHTML += `</div></li>`;
    }); //end each loop
    $employeeDirectoryUL.html(employeeDirectoryHTML);
  }

  //The AJAX request that pulls in the information.
  $.get(randomUserURL, queryString, displayUsers);

  /*
  STEP 2
  Create a modal window that will pop up when any part of the user’s row is clicked. The following details should display in the modal window:
    Image
    Name
    Username
    Email
    Cell Number
    Detailed Address, including street name and number, city, state and/or country and post code.
    Birthdate
  */
  //Get references to the model window and modal content windows.
  const $modalWindow = $('#modal-window');
  const $modalContent = $('#modal-content');

  //Hide the modal window by default.
  $modalWindow.hide();

  //Add an event listener to the UL and take advantage of event bubbling.  This will display the modal window.
  $employeeDirectoryUL.click(function() {
    //Create variables that refer to the event target objects as far back as the "great grand parent", just in case the clicked element is one of the divs with information in it.
    let target = event.target;
    let targetParent = target.parentNode;
    let targetGrandParent = targetParent.parentNode;
    let targetGreatGrandParent = targetGrandParent.parentNode;

    //Create the HTML to be inserted into the modal content and add a close "x" to it.
    let employeeModalHTML = `<span id="modal-close">&times;</span>`;

    //Only show the modal window if one of the employee cards is clicked (<li>, <img>, or <div>).  Not the UL element itself.
    if (targetParent.id === 'employee-directory' || targetGrandParent.id === 'employee-directory' || targetGreatGrandParent.id === 'employee-directory') {
      $modalWindow.show();
    }; //end if

    //Depending on which element is clicked, compare it's ancestor id to the UL id, and display the appropriate content in the modal content window.  Also add the additional content section from the list item (hidden by default in CSS) to the modal content window.
    if (targetParent.id === 'employee-directory') {
      employeeModalHTML += target.innerHTML;
      employeeModalHTML += target.lastElementChild.innerHTML;
    } else if (targetGrandParent.id === 'employee-directory') {
      employeeModalHTML += targetParent.innerHTML;
      employeeModalHTML += targetParent.lastElementChild.innerHTML;
    } else if (targetGreatGrandParent.id === 'employee-directory') {
      employeeModalHTML += targetGrandParent.innerHTML;
      employeeModalHTML += targetGrandParent.lastElementChild.innerHTML;
    }; //end if

    //Empty any contents the modal content might have had.
    $modalContent.empty();

    //Append the newly created HTML with the employee account info to the modal content.
    $modalContent.append(employeeModalHTML);
  }); //End UL 'click' event listener

  //Close the modal window if anything but the modal content div is clicked.
  $modalWindow.click(function(event) {
    //This code will run only if an arrow is clicked.
    if (event.target.classList.contains('modal-arrow')) {
      //Compare the employee name of the modal div to the employee name of the list items.
      //First get the modal employee name.
      const modalEmployee = document.querySelector('#modal-content');
      const modalEmployeeName = modalEmployee.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.textContent;

      //Iterate through the all of the list items and compare the modal name to the list item name.
      const listItems = document.querySelectorAll('li');

      //Create the HTML to be inserted into the modal content and add a close "x" to it.
      let employeeModalHTML = `<span id="modal-close">&times;</span>`;

      //Takes action if the right arrow is clicked.
      if (event.target.getAttribute('id') === 'modal-arrow-right') {
        for (let i = 0; i < listItems.length; i += 1) {
          //If the matching item is not the last list item
          //Else if the matching item is the last list item
          if (getEmployeeName(listItems[i]) === modalEmployeeName && i < 11) {
            i += 1;
            employeeModalHTML += listItems[i].innerHTML;
            employeeModalHTML += listItems[i].lastElementChild.innerHTML;
          } else if (getEmployeeName(listItems[i]) === modalEmployeeName && i === 11) {
            employeeModalHTML += listItems[0].innerHTML;
            employeeModalHTML += listItems[0].lastElementChild.innerHTML;
          }; //end if
        }; //end for
      }; //end if

      //Takes action if the left arrow is clicked.
      if (event.target.getAttribute('id') === 'modal-arrow-left') {
        for (let i = 11; i > -1; i -= 1) {
          //If the matching item is not the first list item
          //Else if the matching item is the first list item
          if (getEmployeeName(listItems[i]) === modalEmployeeName && i > 0) {
            i -= 1;
            employeeModalHTML += listItems[i].innerHTML;
            employeeModalHTML += listItems[i].lastElementChild.innerHTML;
          } else if (getEmployeeName(listItems[i]) === modalEmployeeName && i === 0) {
            employeeModalHTML += listItems[11].innerHTML;
            employeeModalHTML += listItems[11].lastElementChild.innerHTML;
          }; //end if
        }; //end for
      }; //end if

      //Empty any contents the modal content might have had.
      $modalContent.empty();

      //Append the newly created HTML with the employee account info to the modal content.
      $modalContent.append(employeeModalHTML);
    };

    if (event.target !== $modalContent.get(0) && event.target.classList.contains('modal-arrow') === false) {
      $modalWindow.hide();
    }; //end if
  }); //end event listener

  /*
  STEP 3
  Structure and style the user directory so that it roughly matches the provide mockup.
    Display the users in a grid or table
    Add a hover state to the rows of the user table.
    Make sure there’s a way to close the modal window
  */

  //Step 3 was completed through CSS in the main.css file.

  /*
  EXCEEDS EXPECTATIONS
  STEP 1
  Add a way to filter the directory by name or username. To do this, you’ll need to request a random user nationality that will only return data in the English alphabet. Note: you don't have to rely on the API to return search results. You'll need to write functionality that filters results once they already on the page.
  */
  //Gets the employee name text from a list item.
  function getEmployeeName(listItem) {
    const employeeName = listItem.firstElementChild.nextElementSibling.firstElementChild.textContent;
    return employeeName;
  }

  //Gets the employee username text from a list item.
  function getEmployeeUsername(listItem) {
    const employeeUsername = listItem.lastElementChild.firstElementChild.nextElementSibling.textContent;
    return employeeUsername;
  }

  //Saving the search form and input elements into variables.
  const searchForm = document.querySelector('#search-form');
  const searchInput = document.querySelector('input');

  //Event listener for the search form submission.  Will only display users that names/usernames match the search text.
  searchForm.addEventListener('submit', () => {
    //Prevent the page from refreshing on form submission.
    event.preventDefault();

    //Get the text entered into the input element.
    let searchText = searchInput.value;
    let lowerSearchText = searchText.toLowerCase();

    //Get all of the list items and compare names/usernames to the search text.  If they don't match, hide them.
    const listItems = document.querySelectorAll('li');
    for (let i = 0; i < listItems.length; i += 1) {
      listItems[i].style.display = 'inline-block';
      if (getEmployeeName(listItems[i]).indexOf(lowerSearchText) === -1 && getEmployeeUsername(listItems[i]).indexOf(lowerSearchText) === -1) {
        listItems[i].style.display = 'none';
      }; //end if
    }; //end for loop
  }); //end event listener


  /*
  EXCEEDS EXPECTATIONS
  STEP 2
  Add a way to move back and forth between employee detail windows when the modal window is open.
  */

  //Exceeds Step 2 was completed through inside of the modal window click event listener.

}();  //END JAVASCRIPT MODULE PATTERN
