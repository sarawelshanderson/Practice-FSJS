
// this is where we get the files and log it to the console

function getFiles() {
  return $.ajax('/api/file')
    .then(res => {
      console.log("Results from getFiles()", res);
      return res;
    })
    .fail(err => {
      console.error("Error in getFiles()", err);
      throw err;
    });
}

// this refreshes the  items on the shopping list
// this gets all the data and puts it in the div list-container
function refreshFileList() {
  const template = $('#list-template').html();
  const compiledTemplate = Handlebars.compile(template);

  getFiles()
    .then(files => {
      // I have the files
      window.fileList = files;
      //create some arrays to sort files into
      let notNeededFiles = [];
      let neededFiles = [];
      // for each file
      files.forEach(file => {
      //  if file is needed, add to neededFiles
          if (file.inBasket === "true") {
           // console.log("this is true" + file.description);
            neededFiles.push(file.description);
          //  else add to notNeededFiles
          } else {
            //console.log("this is false" + file.description);
            notNeededFiles.push(file.description);
          }    

      })
      console.log("needed files are----" + neededFiles);
      console.log("not needed files are ---- " + notNeededFiles);

      // const neededData = {files: neededFiles}
      // const notNeededData = {files: notNeededFiles}
      // render neededData to #list-container
      // render notNeededData to #list-container2

      const neededData = {files: neededFiles};
      const htmlString = compiledTemplate(neededData);
      $('#list-container').html(htmlString);
    })
}

// this refreshes the data in the already bought list
function refreshFileList2() {
  const template2 = $('#list-template2').html();
  const compiledTemplate2 = Handlebars.compile(template2);

  getFiles()
    .then(files => {

      window.fileList = files;

      const data = {files: files};
      const htmlString2 = compiledTemplate2(data);
      $('#list-container2').html(htmlString2);
    })
}

// this is where the form becomes visible to add an item

function handleAddFileClick() {
  console.log("add file click");
  setFormData({});
  toggleAddFileFormVisibility();
}

// this is where the form becomes hidden to add an item

function toggleAddFileFormVisibility() {
  $('#form-container').toggleClass('hidden');
}

// this is when the submit button is clicked, something is written to the console log
  

function submitFileForm() {
  console.log("You clicked 'submit'. Congratulations.");
  //and where the data is stored in the const fileData
  const fileData = {
    title: $('#file-title').val(),
    description: $('#file-description').val(),
    inBasket: 'true',
    _id: $('#file-id').val(),
  };
  //hmmm
  let method, url;
  if (fileData._id) {
    method = 'PUT';
    url = '/api/file/' + fileData._id;
  } else {
    method = 'POST';
    url = '/api/file';
  }
  // this is where the const fileData turns into json
  $.ajax({
    type: method,
    url: url,
    data: JSON.stringify(fileData),
    dataType: 'json',
    contentType : 'application/json',
  })
    // this is  where the data has posted
    .done(function(response) {
      console.log("We have posted the data");
      refreshFileList();
      toggleAddFileFormVisibility();
    })
    .fail(function(error) {
      console.log("Failures at posting, we are", error);
    })
    // this is where the fileData data is logged to the console
  console.log("Your file data", fileData);
}

// this is where the add file form becomes invisible because cancel was clicked
function cancelFileForm() {
  toggleAddFileFormVisibility();
}

// this is when edit button is clicked and form must become visible and filled in from data found by id
function handleEditFileClick(id) {
  const file = window.fileList.find(file => file._id === id);
  if (file) {
    setFormData(file);
    toggleAddFileFormVisibility();
  }
}

// this is a function that sets the form to something or nothing
function setFormData(data) {
  data = data || {};

  const file = {
    title: data.title || '',
    description: data.description || '',
    _id: data._id || '',
    inBasket: data.inBasket || ''
  };

  $('#file-title').val(file.title);
  $('#file-description').val(file.description);
  $('#file-id').val(file._id);
}

// this is the function that deals with the delete button
function handleDeleteFileClick(id) {
  if (confirm("Are you sure?")) {
    deleteFile(id);
  }
}

// this is the function that deals with deleting the file
function deleteFile(id) {
  $.ajax({
    type: 'DELETE',
    url: '/api/file/' + id,
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("File", id, "is DOOMED!!!!!!");
      refreshFileList();      
    })
    .fail(function(error) {
      console.log("I'm not dead yet!", error);
    })
}



// change the status of inBasket
function changeInBasket(id){  
   const file = window.fileList.find(file => file._id === id);{
    if (file.inBasket === 'true') {
      console.log('in basket is true and needs to be changed to false');
      file.inBasket = 'false';
    } else if (file.inBasket === 'false'){      
      console.log('in basket is false and needs to be changed to true');
      file.inBasket ='true';
    } else {
      console.log('so many problems')
    }
  }
// now update to the database
const fileData = {
  title: file.title,
  description: file.description,
  inBasket: file.inBasket,
  _id: id,
};

// lets update the data by using PUT

let method, url;
if (fileData._id) {
  method = 'PUT';
  url = '/api/file/' + fileData._id;
} else {
  method = 'POST';
  url = '/api/file';
}
// this is where the const fileData turns into json
$.ajax({
  type: method,
  url: url,
  data: JSON.stringify(fileData),
  dataType: 'json',
  contentType : 'application/json',
})
  // this is  where the data has posted
  .done(function(response) {
    console.log("We have posted the data");
    refreshFileList();    
  })
  .fail(function(error) {
    console.log("Failures at posting the change in basket to false", error);
  })
  // this is where the fileData data is logged to the console
console.log("Your file data", fileData);
}



// this refreshes the lists after everything happens
refreshFileList();
refreshFileList2();
