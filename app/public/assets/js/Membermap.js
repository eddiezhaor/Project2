var map;
var infowindow;
var myMarker = [];
var my
var socket = io.connect("http://localhost:3000");

function initMap() {
    var chicago = {
        lat: 41.8781,
        lng: -87.6298
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: chicago,
        zoom: 12
    });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos)
            var locationMarker = new google.maps.Marker({
                map: map,
                label: "You are here"

            })
            locationMarker.setPosition(pos)
            var infowindow = new google.maps.InfoWindow();
            google.maps.event.addListener(locationMarker, 'click', function() {
                infowindow.setContent("Your Location");
                infowindow.open(map, locationMarker);
            });
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
    createMarker(addMarker)

}


// var newMarker2 = [];
// var lat = [];
// var long = [];
// var parkName = [];
// var address = [];
// var mylat;



function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function createMarker(callback) {
    $.get("/api/parkall").then(function(data) {
        callback(data)

    })
}

function addMarker(data) {
    var icon = {
        url: "assets/image/dog2.png",
        labelOrigin: new google.maps.Point(15, -8),
        scaledSize: new google.maps.Size(30, 30),
        origin: new google.maps.Point(0, 0),
        id: 1 // origin
    }
    for (var i = 0; i < data.length; i++) {
        var location = {
            lat: Number(data[i].address_lat),
            lng: Number(data[i].address_long)
        };
        var cnt = new google.maps.LatLng(location);
        var marker = new google.maps.Marker({
            map: map,
            label: {
                color: "red",
                text: data[i].dog_count.toString()
            },

            icon: icon

        })


        marker.set("id", 1);
        marker.setPosition(cnt);
        myMarker.push(marker);
        var infowindow = new google.maps.InfoWindow();
        // console.log(data[i].park_name)
        // var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));
        // google.maps.event.addListener(searchBox, "places_changed", function() {
        //     // removeMarkers()
        //     var marker2 = new google.maps.Marker({
        //         map: map,
        //         icon: icon
        //     });
        //     var places = searchBox.getPlaces()
        //     var bounds = new google.maps.LatLngBounds();
        //     bounds.extend(places[0].geometry.location);
        //     marker2.setPosition(places[0].geometry.location);
        //     google.maps.event.addListener(marker2, 'click', function() {
        //         infowindow.setContent(places[0].name);
        //         infowindow.open(map, this);
        //     });
        //     map.fitBounds(bounds);
        //     map.setZoom(10)
        // })

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                // $.post("/api/park"+data[i].id,{},function(res){

                // })
                $("#updateTime").empty()
                marker.setAnimation(google.maps.Animation.BOUNCE)
                setTimeout(function() { marker.setAnimation(null); }, 2000);
                $.get("/api/parkall", function(result) {
                    // $(".firstModalBody").empty();
                    $(".firstModalTitle").text(data[i].park_name)
                    $(".secondFooter").empty()
                    $(".secondFooter").append(`<p class="text-center"><button data-id=${i} type="button" id="submitData" class="btn btn-default" data-dismiss="modal">Submit</button></p>
                        `)
                        // result.forEach(element => {

                    //     var userDiv = $("<div>").addClass("userDiv");                        // $("#userInfor").append(JSON.stringify(element["dog_name"]).replace(/\"/g, "") + "<br>")("userDiv");
                    //     var userImg = $("<img>").attr("src",element.picture).addClass("userImg");
                    //     var userName= $("<h4>").addClass("userName").text(element.dog_name);
                    //     var userBreed = $("<h4>").addClass("userBreed").text(element.breed);
                    //     var userOwner = $("<h5>").addClass("userOwner").text(`Owner: ${element.owner_Name}`);
                    //     var userThumbsUp = $("<h4>").addClass("userThumbsUp").html(`<i class="fa fa-thumbs-up" aria-hidden="true"></i>: ${element.thumbsUp}`);
                    //     var userThumbsDown = $("<h4>").addClass("userThumbsDown").html(`<i class="fa fa-thumbs-down" aria-hidden="true"></i>: ${element.thumbsUp}`);
                    //     userDiv.append(userImg,userName,userBreed, userOwner, userThumbsUp,userThumbsDown);
                    //     $("#userInfor").append(userDiv);
                    // });
                    $(".firstFooter").empty()
                    $(".firstFooter").append(`<button data-id=${i} id="checkin" type="button" class=" btn btn-default">Check In</button>`).append(` <button type="button" data-id=${i} id="seeUsers" class="btn btn-default" data-dismiss="modal">See who is here!</button>`)
                    $('#myModal').modal('show');
                })
                var indexPlusOne = Number(i) + 1
                $.get("/api/park/" + indexPlusOne, function(dataBack) {
                    // parkHeaderDiv.append(data[i].park_name + "<br>");
                    var lastUpdatedTime = dataBack["updatedAt"];
                    lastUpdatedTime = lastUpdatedTime.slice(0, 10) + " " + lastUpdatedTime.slice(11, 19);
                    var timeDiff = Math.floor((Date.now() - new Date(lastUpdatedTime).getTime()) / (1000 * 60 * 60) + 5);
                    var parkHeaderDiv = $("<div>").addClass("parkHeaderDiv");
                    var parkNameDiv = $("<div>").addClass("parkNameDiv");
                    var parkName = $("<h2>").addClass("parkName").text(data[i].park_name);
                    parkNameDiv.append(parkName);
                    var updatedInfo = $("<h3>").addClass("lastUpdated").text()
                    if (timeDiff < 1) {
                        // parkHeaderDiv.append("Updated less than an hour ago");
                        // $("#updateTime").append(parkHeaderDiv)
                        var updatedInfo = $("<h3>").addClass("lastUpdated").text("Updated less than an hour ago")
                        parkHeaderDiv.append(parkNameDiv, updatedInfo)
                        $("#updateTime").append(parkHeaderDiv);

                    } else {
                        // parkHeaderDiv.append("Updated " + timeDiff + " hours ago");
                        // $("#updateTime").append(parkHeaderDiv);
                        var updatedInfo = $("<h3>").addClass("lastUpdated").text("Updated " + timeDiff + " hours ago")
                        parkHeaderDiv.append(parkNameDiv, updatedInfo)
                        $("#updateTime").append(parkHeaderDiv);
                    }
                })
            }
        })(marker, i));
        $(document).on("click", "#seeUsers", function() {
            var btnID = $(this).attr("data-id")
            var c = Number(btnID) + 1
            console.log(c)
            $.get("/api/user/park/" + c, function(myData) {
                $("#userInfor").empty()
                    // var image = new Image();
                    // console.log(myData[0]['picture'])
                    // image.src = myData[0]["picture"];
                    // $("#userInfor").append(image)
                myData.forEach(element => {
                    var userDiv = $("<div>").addClass("userDiv");
                    var userImg = $("<img>").attr("src", element.picture).addClass("userImg");
                    var userName = $("<h4>").addClass("userName").text(element.dog_name);
                    var userBreed = $("<h4>").addClass("userBreed").text(element.breed);
                    var userOwner = $("<h5>").addClass("userOwner").text(`Owner: ${element.owner_Name}`);
                    var userThumbsUp = $("<h4>").addClass("userThumbsUp").html(`<i class="fa fa-thumbs-up" aria-hidden="true"></i>: ${element.thumbsUp}`);
                    var userThumbsDown = $("<h4>").addClass("userThumbsDown").html(`<i class="fa fa-thumbs-down" aria-hidden="true"></i>: ${element.thumbsDown}`);
                    userDiv.append(userImg, userName, userBreed, userOwner, userThumbsUp, userThumbsDown);
                    $("#userInfor").append(userDiv);
                });
            })
        })
        $(document).on("click", "#submitData", function() {
            var newID = $(this).attr("data-id");
            var rightID = Number(newID) + 1
            var dogCountUpdate = {
                parkID: data[newID].id,
                dog_count: Number($("#dogNumber").val().trim()),
                marker: newID
            };
            $.get("/memberInfor", function(data) {
                $.ajax({
                    url: "/api/user/park/" + data.id,
                    type: "PUT",
                    data: { currentParkID: rightID }
                }).then(function(data) {
                    console.log(data)
                    $.get("/api/user/park/" + rightID, function(myData) {
                        $("#userInfor").empty()
                        $("#myModal").modal("hide")
                            // var image = new Image();
                            // console.log(myData[0]['picture'])
                            // image.src = myData[0]["picture"];
                            // $("#userInfor").append(image)
                        myData.forEach(element => {
                            var userDiv = $("<div>").addClass(`userDiv userDiv${element.id}`); // $("#userInfor").append(JSON.stringify(element["dog_name"]).replace(/\"/g, "") + "<br>")("userDiv");
                            var userImg = $("<img>").attr("src", element.picture).addClass("userImg");
                            var userName = $("<h4>").addClass("userName").text(element.dog_name);
                            var userBreed = $("<h4>").addClass("userBreed").text(element.breed);
                            var userOwner = $("<h5>").addClass("userOwner").text(`Owner: ${element.owner_Name}`);
                            var userThumbsUp = $("<h4>").addClass("userThumbsUp").html(`<button class="plusOne btn btn-success hide${element.id}" data-id="${element.id}"><i class="fa fa-thumbs-up" aria-hidden="true"></i> ${element.thumbsUp}</button>`);
                            var userThumbsDown = $("<h4>").addClass("userThumbsDown").html(`<button class="downOne btn btn-success hide${element.id}" data-id="${element.id}"><i class="fa fa-thumbs-down" aria-hidden="true"></i> ${element.thumbsDown}</button>`);
                            userDiv.append(userImg, userName, userBreed, userOwner, userThumbsUp, userThumbsDown);
                            $("#userInfor").append(userDiv);
                        });

                        $("#dogNumber").val("");
                    })
                })

            })


            console.log(dogCountUpdate)


            $.ajax({
                url: `/api/park/newDog/${dogCountUpdate.parkID}`,
                method: "PUT",
                data: dogCountUpdate
            }).then((data) => {
                console.log(`updated park id${dogCountUpdate.parkID} with ${dogCountUpdate.dog_count}`);
                socket.emit("dogCountUpdate", { dogCountUpdate });

            })


            // setNumber(marker)


        });

        //Update thumbs up when given one
        $(document).on("click", ".plusOne", function() {
            // $(this).hide();
            // $(".downOne").hide();
            var userID = $(this).attr("data-id");
            $(`.hide${userID}`).hide();
            // $(`.userDiv${userID}`).append($("<h5>").text("Vote Added!"));
            // var c = Number(btnID) + 1
            // console.log(c)
            $.get(`/api/user/thumbs/${userID}`, function(myData) {
                console.log(myData);
                var updateThumbsUp = Number(myData.thumbsUp) + 1;
                dogThumbUpdate = {
                    thumbsUp: updateThumbsUp,
                    thumbsDown: myData.thumbsDown
                };
                $.ajax({
                    url: `/api/user/thumbs/${userID}`,
                    method: "PUT",
                    data: dogThumbUpdate
                }).then((data) => {
                    console.log("thumbUpdated");
                })
            });
        });
        // update thumbs down when given ones
        $(document).on("click", ".downOne", function() {
            var userID = $(this).attr("data-id");
            // $(this).hide();
            // $(".plusOne").hide();
            $(`.hide${userID}`).hide();
            // $(`.userDiv${userID}`).append($("<h5>").text("Vote Added!"));
            // var c = Number(btnID) + 1
            // console.log(c)
            $.get(`/api/user/thumbs/${userID}`, function(myData) {
                console.log(myData);
                var updateThumbsDown = Number(myData.thumbsDown) + 1;
                var dogThumbUpdate = {
                    thumbsUp: myData.thumbsUp,
                    thumbsDown: updateThumbsDown
                };
                $.ajax({
                    url: `/api/user/thumbs/${userID}`,
                    method: "PUT",
                    data: dogThumbUpdate
                }).then((data) => {
                    console.log("thumbUpdated");
                })
            });
        });
        google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
            return function() {
                infowindow.setContent(data[i].park_name);
                infowindow.open(map, marker);
            }
        })(marker, i));
        google.maps.event.addListener(marker, 'mouseout', (function(marker, i) {
            return function() {
                infowindow.close()
            }
        })(marker, i));
        socket.on("dogCountUpdate", function(data) {
            console.log(data.data.dogCountUpdate.marker);
            var mymark = myMarker[data.data.dogCountUpdate.marker]
                // console.log(mymark)
            $.ajax({
                url: `/api/park/${data.data.dogCountUpdate.parkID}`,
                method: "GET"
            }).then((data) => {
                var newLabel = {
                    color: "red",
                    text: data.dog_count.toString()
                }


                mymark.setLabel(newLabel)
                    // $("#dogNumber").val("")


            })
        })
    }
}

function setNumber(marker) {
    marker.setLabel()
}
// function placeMarker(location) {

// }
// var marker = new google.maps.Marker({
//     position: location, 
//     map: map
// });

// var icon = {
//     url: "../image/dog.png",
//     labelOrigin: new google.maps.Point(9, -8),
//     scaledSize: new google.maps.Size(20, 20),
//     origin: new google.maps.Point(0, 0), // origin
// }

// function initMap() {

//     console.log(mylat)
//     var chicago = {
//         lat: 41.8781,
//         lng: -87.6298
//     };

//     map = new google.maps.Map(document.getElementById('map'), {
//         center: chicago,
//         zoom: 11
//     });
//     var autocomplete = new google.maps.places.Autocomplete(
//         /** @type {!HTMLInputElement} */
//         (
//             document.getElementById('pac-input')));
//     $("#pac-input").keyup(function(e) {
//         if (e.KeyCode = 13) {
//             if ($("#pac-input").val() == "") {
//                 addMarkers();
//                 removeMarker2();
//             }
//         }
//     })
// var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));
//     google.maps.event.addListener(searchBox, "places_changed", function() {
//         removeMarkers()
//         var marker2 = new google.maps.Marker({
//             map: map,
//             icon: icon
//         });
//         var places = searchBox.getPlaces()
//         var bounds = new google.maps.LatLngBounds();
//         bounds.extend(places[0].geometry.location);
//         marker2.setPosition(places[0].geometry.location);
//         google.maps.event.addListener(marker2, 'click', function() {
//             infowindow.setContent(places[0].name);
//             infowindow.open(map, this);
//         });
//         map.fitBounds(bounds);
//         map.setZoom(10)
//         newMarker2.push(marker2);
//         for (var j = 0; j < newMarker2.length; j++) {
//             if (j === 0) {
//                 newMarker2[0].setVisible(true)
//             } else {
//                 newMarker2[j].setVisible(true)
//                 newMarker2[j - 1].setVisible(false)
//             }
//         }
//     });
//     infowindow = new google.maps.InfoWindow();
//     var service = new google.maps.places.PlacesService(map);
//     service.nearbySearch({
//         location: chicago,
//         radius: 100000,
//         keyword: "dog park"
//     }, callback);
// }

// function callback(results, status) {
//     if (status === google.maps.places.PlacesServiceStatus.OK) {
//         for (var i = 0; i < results.length; i++) {
//             results[i].number = i;
//             createMarker(results[i]);
//         }
//         // $.ajax({
//         // console.log(myMarker)
//         // $.post("/api/park", { "address": address }, function(data) {
//         //         console.log("nice")
//         //     })
//         // })
//     }
// }

// function createMarker(place) {
//     console.log(place)
//     var placeLoc = place.geometry.location;
//     var icon = {
//         url: "./dog.png",
//         labelOrigin: new google.maps.Point(9, -8),
//         scaledSize: new google.maps.Size(20, 20),
//         origin: new google.maps.Point(0, 0), // origin
//         anchor: new google.maps.Point(11, 40)
//     }
//     var marker = new google.maps.Marker({
//         map: map,
//         position: placeLoc,
//         label: {
//             color: "red",
//             text: place.number.toString()
//         },
//         icon: icon,
//     });
//     myMarker.push(marker);
//     lat.push(marker.position.lat())
//     long.push(marker.position.lng())
//     parkName.push(place.name)
//     address.push(place.vicinity)
//     google.maps.event.addListener(marker, 'click', function() {
//         infowindow.setContent(place.name);
//         infowindow.open(map, this);
//     });
// }

// function removeMarkers() {
//     for (var i = 0; i < myMarker.length; i++) {
//         myMarker[i].setVisible(false);
//     }
// }

// function addMarkers() {
//     for (var k = 0; k < myMarker.length; k++) {
//         myMarker[k].setVisible(true);
//     }
// }

// function removeMarker2() {
//     for (var l = 0; l < newMarker2.length; l++) {
//         newMarker2[l].setVisible(false);
//     }
// }



$("#addClass").click(function() {
    $('#sidebar_secondary').addClass('popup-box-on');
});
$("#removeClass").click(function() {
    $('#sidebar_secondary').removeClass('popup-box-on');
});
$(".chat_sidebar").draggable()

$(document).on("click", "#checkin", function() {
    $("#checkinForm").empty()
    var input = $(`<input type="checkbox" name="list" value="house">house<br>`)
    $("#checkinForm").append(input)
    $("#checkinModal").modal("show")

})



//Magic Below 


// $("#submit").click(function() {

// })