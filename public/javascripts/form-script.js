const videoDetails = document.getElementById('video-details');
const addMoreVideos = document.getElementById('add-more-videos');
const removeVideos = document.getElementById('remove-videos');

addMoreVideos.onclick = function(){
    
    const newField0 = document.createElement('div');
    newField0.setAttribute('class', "col-md-6");

    const newField1 = document.createElement('label');
    newField1.setAttribute('class', "input-group-url");
    newField1.innerText = 'Copy Video ID' ;

    const newField2 = document.createElement('input');
    newField2.setAttribute('type', 'text');
    newField2.setAttribute('name', 'videoId');
    newField2.setAttribute('class', 'form-control');

    const newField3 = document.createElement('div');
    newField3.setAttribute('class', "col-md-6");
    
    const newField4 = document.createElement('label');
    newField4.setAttribute('class', "input-group-url");
    newField4.innerText = 'From which platform:' ;

    const newField5 = document.createElement('select');
    newField5.setAttribute('name', 'platform');
    newField5.setAttribute('class', 'form-control');
    newField5.setAttribute('placeholder', "https://example.com");

    const newField6 = document.createElement('option');
    newField6.setAttribute('disabled', '');
    newField6.setAttribute('selected', '');
    newField6.innerText = 'Choose platform' ;

    const newField7 = document.createElement('option');
    newField7.setAttribute('value', 'YouTube');
    newField7.innerText = 'YouTube' ;

    const newField8 = document.createElement('option');
    newField8.setAttribute('value', 'Vimeo');
    newField8.innerText = 'Vimeo' ;

    newField5.options.add(newField6);
    newField5.options.add(newField7);
    newField5.options.add(newField8);

newField0.appendChild(newField1); 
newField0.appendChild(newField2);

newField3.appendChild(newField4);
newField3.appendChild(newField5);

videoDetails.appendChild(newField0);
videoDetails.appendChild(newField3)
}

removeVideos.onclick = function(){
    const inputTags = document.getElementById('video-details');
    inputTags.removeChild(inputTags.lastChild)
    inputTags.removeChild(inputTags.lastChild)

}

